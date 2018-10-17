import { LoggerBuilder } from "simplr-logger";

import { SocketClient } from "../abstractions/socket-client";
import { NoiaNodeWorkerEvent, NoiaNodeWorkerRequestData, PieceResult, NodePieceRequest } from "../contracts/node";
// import * as Worker from "worker-loader!./pieces.worker";

const NUMBER_OF_CORES = (window != null && window.navigator != null && window.navigator.hardwareConcurrency) || 2;

export interface PiecePromiseResolver {
    pieceIndex: number;
    resolve: (result: PieceResult) => void;
    reject: (reason: string) => void;
    done: boolean;
}

export interface NodeClientOptions {
    nodeAddress: string;
    workerConstructor: () => Worker;
    logger: LoggerBuilder;
}

export class NodeClient extends SocketClient {
    constructor({ nodeAddress, logger, workerConstructor }: NodeClientOptions) {
        super({ address: nodeAddress, logger: logger });

        this.workers = [];

        for (let index = 0; index < NUMBER_OF_CORES; index++) {
            this.workers.push(workerConstructor());
        }

        for (const worker of this.workers) {
            worker.addEventListener("message", (event: NoiaNodeWorkerEvent) => {
                const data = event.data;
                const pieceResolver = this.piecePromiseResolvers.find(x => x.pieceIndex === data.index);

                if (pieceResolver == null) {
                    this.logger.Warn(
                        `Piece #${data.index} was processed, but there were only ${this.piecePromiseResolvers.length} piece requests.`
                    );
                    return;
                }

                if (pieceResolver.done) {
                    return;
                }

                pieceResolver.resolve(data);
            });
        }

        this.socket.addEventListener("message", async message => {
            const worker = this.nextWorker();

            if (worker == null) {
                this.logger.Warn("No workers found.");
                return;
            }

            worker.postMessage({
                blob: message.data
            } as NoiaNodeWorkerRequestData);
        });
    }

    protected workers: Worker[];
    protected lastUsedWorkerIndex: number = 0;
    protected piecePromiseResolvers: PiecePromiseResolver[] = [];

    public isBusy(): boolean {
        return this.piecePromiseResolvers.some(x => !x.done);
    }

    public async downloadPiece(pieceRequest: NodePieceRequest): Promise<PieceResult> {
        return new Promise<PieceResult>(async (resolve, reject) => {
            const clientSocket = await this.connect();

            const piecePromiseResolver: PiecePromiseResolver = {
                pieceIndex: pieceRequest.piece,
                resolve: result => {
                    piecePromiseResolver.done = true;
                    resolve(result);
                },
                reject: reason => {
                    piecePromiseResolver.done = true;
                    reject(reason);
                },
                done: false
            };
            this.piecePromiseResolvers.push(piecePromiseResolver);

            clientSocket.send(JSON.stringify(pieceRequest));
        });
    }

    protected nextWorker(): Worker | undefined {
        if (this.workers.length === 0) {
            return undefined;
        }

        if (this.lastUsedWorkerIndex >= this.workers.length - 1) {
            this.lastUsedWorkerIndex = 0;
        } else {
            this.lastUsedWorkerIndex++;
        }

        return this.workers[this.lastUsedWorkerIndex];
    }
}
