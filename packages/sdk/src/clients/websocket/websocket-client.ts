import { ClientBase, ClientBaseOptions } from "../../abstractions/client-base";
import { NodePieceRequest, PieceResult } from "../../contracts/node";
import { WorkersPool } from "../../workers/workers-pool";
import { DefaultWorker } from "../../workers/default-worker";
import { WebSocketPool } from "./websocket-pool";
import { protoJson } from "../proto";
import { PiecesWorkerMessage, ResultStatus, Sha1WorkerMessage } from "../../contracts/worker";

export interface WebSocketOptions extends ClientBaseOptions {
    webSocketPool: WebSocketPool;
    piecesPool: WorkersPool<DefaultWorker>;
}

export class WebSocketClient extends ClientBase {
    constructor(options: WebSocketOptions) {
        super(options);

        this.webSocketPool = options.webSocketPool;
        this.piecesPool = options.piecesPool;
    }

    protected readonly webSocketPool: WebSocketPool;
    protected readonly piecesPool: WorkersPool<DefaultWorker>;

    protected getProtoJson(): {} {
        return protoJson;
    }

    protected async ensurePeersHandler(): Promise<void> {
        return new Promise<void>(async resolve => {
            for (const peer of this.masterData.peers) {
                const address = `wss://${peer.host}:${peer.ports.wss}`;
                this.logger.Debug(`Adding peer '${address}' to '${this.src}'.`);
                this.webSocketPool.addFilePeer(this.src, address);
            }
            resolve();
        });
    }

    protected async getPieceHandler(pieceRequest: NodePieceRequest): Promise<PieceResult> {
        const peer = await this.webSocketPool.reserveAvailablePeer(this.src);
        this.logger.Debug(`Connecting to WebSocket peer for ${this.src} piece #${pieceRequest.index} (${pieceRequest.contentId})`);
        const client = await peer.connect();
        this.logger.Debug(`Connected to WebSocket peer for ${this.src} piece #${pieceRequest.index} (${pieceRequest.contentId})`);

        const promise = new Promise<PieceResult>((resolve, reject) => {
            client.addListener("error", error => {
                reject(error);
            });

            const pieceIndex = pieceRequest.index;
            const integritySha1 = this.masterData.metadata.piecesIntegrity[pieceIndex];

            client.addListener("message", async message => {
                const pieceResult = await this.handleData(message, pieceIndex, integritySha1);
                resolve(pieceResult);
            });
            this.logger.Debug(`Sending request to client...`, pieceRequest);
            client.sendJson(pieceRequest);
        });

        promise.then(() => {
            peer.release();
        });

        return promise;
    }

    protected async handleData(message: MessageEvent, pieceIndex: number, integritySha1: string): Promise<PieceResult> {
        this.logger.Debug("message", message);
        this.logger.Debug("pieceIndex", pieceIndex);
        this.logger.Debug("integritySha1", integritySha1);

        return new Promise<PieceResult>(async (resolve, reject) => {
            const piecesWorker = await this.piecesPool.reserveAvailableWorker();
            piecesWorker.worker.addEventListener("message", async piecesMessage => {
                const pieceMessageData: PiecesWorkerMessage<PieceResult> = piecesMessage.data;

                if (pieceMessageData.status === ResultStatus.Error) {
                    piecesWorker.release();
                    reject(pieceMessageData.error);
                    return;
                }

                const responseData = pieceMessageData.data;

                const sha1Worker: DefaultWorker = await this.sha1Pool.reserveAvailableWorker();
                const messageId: string = `${+new Date()}`;
                const sha1Promise = new Promise(sha1Resolve => {
                    sha1Worker.worker.addEventListener("message", sha1Message => {
                        const sha1Data: Sha1WorkerMessage = sha1Message.data;
                        if (messageId === sha1Data.id) {
                            sha1Resolve(sha1Data.hash);
                        }
                    });
                });
                sha1Worker.worker.postMessage({ id: messageId, data: responseData.buffer });
                const sha1Hash = await sha1Promise;

                sha1Worker.release();

                if (sha1Hash !== integritySha1) {
                    reject(
                        `Integrity check failed for ${
                            this.src
                        } piece #${pieceIndex}. Expected '${integritySha1}' hash, but got '${sha1Hash}'`
                    );
                    return;
                } else {
                    this.logger.Debug(`Integrity check succeeded for ${this.src} piece #${pieceIndex}: ${sha1Hash}`);
                }

                piecesWorker.release();
                resolve({
                    contentId: responseData.contentId,
                    index: responseData.index,
                    offset: responseData.offset,
                    buffer: Buffer.from(responseData.buffer)
                });
            });

            piecesWorker.worker.postMessage({
                blob: message.data
            });
        });
    }
}
