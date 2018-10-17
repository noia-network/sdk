import { MasterResponse, NoiaRequest } from "./contracts/master";
import { WebRtcClient } from "./clients/webrtc/webrtc-client";
import { NodeBytesRequest, PieceResult, NodePieceRequest } from "./contracts/node";
import { LoggerBuilder } from "simplr-logger";
import { NoiaStreamDto } from "./contracts/sdk";

export interface NoiaStreamOptions {
    metadata: MasterResponse;
    request: NoiaRequest;
    webRtcClient: WebRtcClient;
    logger: LoggerBuilder;
}

export class NoiaStream implements NoiaStreamDto {
    constructor(options: NoiaStreamOptions) {
        this.metadata = options.metadata;
        this.request = options.request;
        this.webRtcClient = options.webRtcClient;
        this.logger = options.logger;
    }

    public metadata: MasterResponse;
    protected request: NoiaRequest;
    protected webRtcClient: WebRtcClient;
    protected logger: LoggerBuilder;

    public async getPiece(pieceRequest: NodePieceRequest): Promise<PieceResult> {
        return this.webRtcClient.getPiece(pieceRequest);
    }

    public async getBytes(bytesRequest: NodeBytesRequest): Promise<Buffer> {
        const timeStart = performance.now();
        const { pieceLength: pieceBufferLength, length: bufferLength, infoHash: contentId } = this.metadata.torrent;

        if (bytesRequest.start > bufferLength) {
            this.logger.Warn(`Start is ${bytesRequest.start}, but the bufferLength is ${bufferLength}.`);
            return new Buffer([]);
        }

        const pieceIndexes = this.bytesRequestToPieceIndexes(bytesRequest, pieceBufferLength);

        const promises: Array<Promise<PieceResult>> = [];
        for (let pieceIndex = pieceIndexes.starting; pieceIndex <= pieceIndexes.ending; pieceIndex++) {
            const promise = this.webRtcClient.getPiece({
                infoHash: contentId,
                length: pieceBufferLength,
                offset: 0,
                piece: pieceIndex
            });
            promises.push(promise);
        }
        const pieces: PieceResult[] = await Promise.all(promises);

        if (pieces.length === 0) {
            return new Buffer([]);
        }

        const piecesBuffer = Buffer.concat(pieces.map(x => x.data));
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
        const { torrent } = this.metadata;

        const promises: Array<Promise<PieceResult>> = [];
        this.logger.Debug(`Pieces count: ${torrent.pieces.length}`);
        for (let index = 0; index < torrent.pieces.length; index++) {
            if (torrent.pieces.hasOwnProperty(index)) {
                const piecePromise = this.webRtcClient.getPiece({
                    infoHash: torrent.infoHash,
                    length: torrent.pieceLength,
                    offset: 0,
                    piece: index
                });
                promises.push(piecePromise);
            }
        }
        this.logger.Debug(`Promises count: ${promises.length}`);

        const pieces: PieceResult[] = await Promise.all(promises);
        return Buffer.concat(pieces.map(x => x.data));
    }

    public bufferPieces(startingPieceIndex: number, numberOfPiecesToBuffer: number): void {
        for (let pieceIndex = startingPieceIndex; pieceIndex < startingPieceIndex + numberOfPiecesToBuffer; pieceIndex++) {
            if (pieceIndex > this.metadata.torrent.pieces.length - 1) {
                return;
            }
            // Just get piece without awaiting.
            this.getPiece({
                infoHash: this.metadata.torrent.infoHash,
                length: this.metadata.torrent.pieceLength,
                offset: 0,
                piece: pieceIndex
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
