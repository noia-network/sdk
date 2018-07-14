import { SocketClient } from "../abstractions/socket-client";
import { PieceRequest, NoiaNodeWorkerEvent, NoiaNodeWorkerRequestData, NodeResult } from "../contracts/node-client";
// import * as Worker from "worker-loader!./pieces.worker";

const NUMBER_OF_CORES = (window != null && window.navigator != null && window.navigator.hardwareConcurrency) || 2;

export interface PiecePromiseResolver {
    pieceIndex: number;
    resolve: (result: NodeResult) => void;
    reject: (reason: string) => void;
    done: boolean;
}

export class NodeClient extends SocketClient {
    constructor(nodeAddress: string, workerConstructor: () => Worker) {
        super(nodeAddress);

        this.workers = [];

        for (let index = 0; index < NUMBER_OF_CORES; index++) {
            this.workers.push(workerConstructor());
        }

        for (const worker of this.workers) {
            worker.addEventListener("message", (event: NoiaNodeWorkerEvent) => {
                const data = event.data;
                const pieceResolver = this.piecePromiseResolvers.find(x => x.pieceIndex === data.index);

                if (pieceResolver == null) {
                    console.warn(
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
                console.warn("No workers found.");
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

    public async downloadPiece(pieceRequest: PieceRequest): Promise<NodeResult> {
        return new Promise<NodeResult>(async (resolve, reject) => {
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
