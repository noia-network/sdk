import { WebRtcPool } from "./webrtc-pool";
import { NodePieceRequest, PieceResult } from "../../contracts/node";
import { DefaultWorker } from "../../workers/default-worker";
import { Sha1WorkerMessage } from "../../contracts/worker";
import { ClientBase, ClientBaseOptions } from "../../abstractions/client-base";
import { ContentResponse } from "@noia-network/protocol";
import { protoJson } from "../proto";

export interface WebRtcClientOptions extends ClientBaseOptions {
    webRtcPool: WebRtcPool;
}

export class WebRtcClient extends ClientBase {
    constructor(options: WebRtcClientOptions) {
        super(options);
        this.webRtcPool = options.webRtcPool;
    }

    protected readonly webRtcPool: WebRtcPool;

    protected getProtoJson(): {} {
        return protoJson;
    }

    protected async ensurePeersHandler(): Promise<void> {
        return new Promise<void>(async resolve => {
            for (const peer of this.masterData.peers) {
                const address = `http://${peer.host}:${peer.ports.webrtc}`;
                this.logger.Debug(`Adding peer '${address}' to '${this.src}'.`);
                this.webRtcPool.addFilePeer(this.src, address, {
                    proxyControlAddress: this.masterData.settings.proxyControlAddress
                });
            }
            resolve();
        });
    }

    protected async getPieceHandler(pieceRequest: NodePieceRequest): Promise<PieceResult> {
        const peer = await this.webRtcPool.reserveAvailablePeer(this.src);
        this.logger.Debug(`Connecting to WebRTC peer for ${this.src} piece #${pieceRequest.index} (${pieceRequest.contentId})`);
        const client = await peer.connect();
        this.logger.Debug(`Connected to WebRTC peer for ${this.src} piece #${pieceRequest.index} (${pieceRequest.contentId})`);
        const promise = new Promise<PieceResult>((resolve, reject) => {
            client.addListener("error", error => {
                reject(error);
            });
            const pieceIndex = pieceRequest.index;
            const integritySha1 = this.masterData.metadata.piecesIntegrity[pieceIndex];
            client.addListener("data", async message => {
                this.logger.Debug(message);
                if (!(message instanceof ArrayBuffer)) {
                    reject("Message type is not ArrayBuffer.");
                    return;
                }
                const pieceResult = await this.handleData(message, pieceIndex, integritySha1);
                resolve(pieceResult);
            });
            this.logger.Debug(`Sending request to client...`, pieceRequest);
            client.send(JSON.stringify(pieceRequest));
        });
        promise.then(() => {
            peer.release();
        });
        return promise;
    }

    protected async handleData(data: ArrayBuffer, pieceIndex: number, integritySha1: string): Promise<PieceResult> {
        this.logger.Debug(`Got response`, data);
        this.logger.Debug(`Decoding data...`);
        const content: ContentResponse = await this.decodeData(data);
        this.logger.Debug(`Data has been decoded.`);

        this.logger.Debug(`================================`);
        this.logger.Debug(content);

        if (content.status !== 200 || content.data == null) {
            throw new Error(content.error);
        }

        const responseData = content.data;

        // TODO: Profile and decide should this be moved to worker or not.
        // For now, let's do it synchronously.
        // const buffer = Buffer.from(data);
        // const responseIndex = buffer.readUInt32BE(0);
        // const responseOffset = buffer.readUInt32BE(0 + 4);
        // const responseInfoHash = buffer.toString("hex", 4 + 4, 24 + 4);
        // const responseData = buffer.slice(24 + 4, buffer.length);

        // Piece data SHA1 integrity check.
        const sha1Worker: DefaultWorker = await this.sha1Pool.reserveAvailableWorker();
        const messageId: string = `${+new Date()}`;
        const sha1Promise = new Promise(sha1Resolve => {
            sha1Worker.worker.addEventListener("message", message => {
                const sha1Data: Sha1WorkerMessage = message.data;
                if (messageId === sha1Data.id) {
                    sha1Resolve(sha1Data.hash);
                }
            });
        });
        sha1Worker.worker.postMessage({ id: messageId, data: responseData.buffer });
        const sha1Hash = await sha1Promise;

        sha1Worker.release();

        if (sha1Hash !== integritySha1) {
            throw new Error(
                `Integrity check failed for ${this.src} piece #${pieceIndex}. Expected '${integritySha1}' hash, but got '${sha1Hash}'`
            );
        } else {
            this.logger.Debug(`Integrity check succeeded for ${this.src} piece #${pieceIndex}: ${sha1Hash}`);
        }

        return {
            contentId: responseData.contentId,
            index: responseData.index,
            offset: responseData.offset,
            buffer: Buffer.from(responseData.buffer)
        };
    }
}
