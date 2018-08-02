import { EventSubscription } from "fbemitter";
import { NodeResult, PieceRequest } from "./contracts/node-client";

// tslint:disable-next-line no-any
export interface Dictionary<TValue = any> {
    [key: string]: TValue;
}

export interface NoiaRequest {
    src: string;
}

export enum ConnectionType {
    Webrtc = "webrtc",
    Ws = "ws"
}

export interface NoiaPieceRequest extends NoiaRequest {
    pieceIndex: number;
}
export interface FileInfo {
    piecesCount: number;
    contentLength: number;
    pieceLength: number;
}

export interface NoiaEmitter {
    addListener<TKey extends keyof NoiaClientEventMap>(
        eventType: TKey,
        listener: (event: NoiaClientEventMap[TKey]) => void | Promise<void>
    ): EventSubscription;
    fileInfo: Promise<FileInfo>;
}

export interface NoiaStreamDto {
    emitter: NoiaEmitter;
    start: () => void;
}

export interface NoiaClient {
    download(dto: NoiaRequest): Promise<Buffer>;
    downloadPiece(dto: NoiaPieceRequest): Promise<Buffer>;
    stream(dto: NoiaRequest): NoiaStreamDto;
}

export interface NoiaPieceDto {
    index: number;
    data: Buffer;
}

export interface NoiaPieceStartDto {
    index: number;
    promise: Promise<NodeResult>;
}

export interface NoiaClientEventMap {
    fileInfo: FileInfo;
    fileDone: Buffer;
    pieceDone: NoiaPieceDto;
    pieceStart: NoiaPieceStartDto;
    allPiecesStarted: {};
    webRtcPieceStart: WebRTCPieceResponse;
    webRtcPieceDone: ArrayBuffer;
}

export interface WebRTCPieceResponse {
    index: number;
    infoHash: string;
    offset: number;
    data?: Buffer;
}
