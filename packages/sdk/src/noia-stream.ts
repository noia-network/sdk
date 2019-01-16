import { NoiaRequest, MasterData, ConnectionType } from "./contracts/master";
import { WebRtcClient } from "./clients/webrtc/webrtc-client";
import { NodeBytesRequest, PieceResult, NodePieceRequest } from "./contracts/node";
import { LoggerBuilder } from "simplr-logger";
import { NoiaStreamDto } from "./contracts/sdk";
import { WebSocketClient } from "./clients/websocket/websocket-client";
import { MasterClient } from "./clients/master-client";
import { ClientBase } from "./abstractions/client-base";
import { Encryption } from "./encryption";

export interface NoiaStreamOptions {
    masterData: MasterData;
    masterClient: MasterClient;
    request: NoiaRequest;
    webRtcClient: WebRtcClient;
    webSocketClient: WebSocketClient;
    logger: LoggerBuilder;
}

export class NoiaStream implements NoiaStreamDto {
    constructor(options: NoiaStreamOptions) {
        this.masterData = options.masterData;
        this.masterClient = options.masterClient;
        this.request = options.request;
        this.webRtcClient = options.webRtcClient;
        this.webSocketClient = options.webSocketClient;
        this.logger = options.logger;
    }

    public masterData: MasterData;
    public masterClient: MasterClient;
    protected request: NoiaRequest;
    protected webRtcClient: WebRtcClient;
    protected webSocketClient: WebSocketClient;
    protected logger: LoggerBuilder;

    protected async getClient(): Promise<ClientBase> {
        if (await this.masterClient.hasMetadata(this.masterData.src, ConnectionType.WebRtc)) {
            return this.webRtcClient;
        }
        if (await this.masterClient.hasMetadata(this.masterData.src, ConnectionType.Wss)) {
            return this.webSocketClient;
        }
        throw new Error("No available clients for supported connection types were found.");
    }

    public async getPiece(pieceRequest: NodePieceRequest): Promise<PieceResult> {
        const client = await this.getClient();
        return client.getPiece(pieceRequest);
    }

    public async getBytes(bytesRequest: NodeBytesRequest): Promise<Buffer> {
        const timeStart = performance.now();
        const { pieceBufferLength, bufferLength, contentId } = this.masterData.metadata;

        if (bytesRequest.start > bufferLength) {
            this.logger.Warn(`Start is ${bytesRequest.start}, but the bufferLength is ${bufferLength}.`);
            return new Buffer([]);
        }

        const pieceIndexes = this.bytesRequestToPieceIndexes(bytesRequest, pieceBufferLength);

        const client = await this.getClient();

        const promises: Array<Promise<PieceResult>> = [];
        for (let pieceIndex = pieceIndexes.starting; pieceIndex <= pieceIndexes.ending; pieceIndex++) {
            const promise = client.getPiece({
                contentId: contentId,
                offset: 0,
                index: pieceIndex
            });
            promises.push(promise);
        }
        const pieces: PieceResult[] = await Promise.all(promises);

        if (pieces.length === 0) {
            return new Buffer([]);
        }

        this.logger.Debug(`pieces`, pieces);

        const piecesBuffer = Buffer.concat(pieces.map(x => x.buffer));
        const globalOffset = pieceIndexes.starting * pieceBufferLength;
        const resultStartingByte = bytesRequest.start - globalOffset;
        const resultEndingByte = bytesRequest.start + bytesRequest.length - globalOffset;
        const resultBuffer = piecesBuffer.slice(resultStartingByte, resultEndingByte);

        this.logger.Debug("globalOffset", globalOffset, resultStartingByte, resultEndingByte);
        this.logger.Debug({
            piecesBuffer: piecesBuffer,
            globalOffset: globalOffset,
            resultStartingByte: resultStartingByte,
            resultEndingByte: resultEndingByte,
            resultBuffer: resultBuffer
        });

        const timeEnd = performance.now();
        const totalTime = timeEnd - timeStart;
        this.logger.Debug(
            `It took ${Math.round(totalTime * 100) / 100}ms to get ${bytesRequest.length} bytes starting from ${bytesRequest.start}.`
        );

        return resultBuffer;
    }

    public async getAllBytes(): Promise<Buffer> {
        const { metadata } = this.masterData;

        try {
            const client = await this.getClient();

            const promises: Array<Promise<PieceResult>> = [];
            this.logger.Debug(`Pieces count: ${metadata.piecesIntegrity.length}`);

            for (let index = 0; index < metadata.piecesIntegrity.length; index++) {
                if (metadata.piecesIntegrity.hasOwnProperty(index)) {
                    const piecePromise = client.getPiece({
                        contentId: metadata.contentId,
                        offset: 0,
                        index: index
                    });
                    promises.push(piecePromise);
                }
            }
            this.logger.Debug(`Promises count: ${promises.length}`);

            const pieces: PieceResult[] = await Promise.all(promises);
            return Buffer.concat(pieces.map(x => x.buffer));
        } catch (err) {
            const data = await fetch(this.masterData.src);
            return Encryption.toBuffer(await data.arrayBuffer());
        }
    }

    public bufferPieces(startingPieceIndex: number, numberOfPiecesToBuffer: number): void {
        for (let pieceIndex = startingPieceIndex; pieceIndex < startingPieceIndex + numberOfPiecesToBuffer; pieceIndex++) {
            if (pieceIndex > this.masterData.metadata.piecesIntegrity.length - 1) {
                return;
            }
            // Just get piece without awaiting.
            this.getPiece({
                contentId: this.masterData.metadata.contentId,
                offset: 0,
                index: pieceIndex
            });
        }
    }

    public bufferBytes(bytesRequest: NodeBytesRequest): void {
        // Just get bytes without awaiting.
        this.getBytes(bytesRequest);
    }

    private bytesRequestToPieceIndexes(bytesRequest: NodeBytesRequest, pieceBufferLength: number): { starting: number; ending: number } {
        const startingPieceIndex = Math.floor(bytesRequest.start / pieceBufferLength);
        const endingByte = bytesRequest.start + bytesRequest.length;
        const endingPieceIndex = Math.floor(endingByte / pieceBufferLength);
        return { starting: startingPieceIndex, ending: endingPieceIndex };
    }
}
