import { NoiaRequest, MasterResponse } from "./master";
import { NodePieceRequest, PieceResult, NodeBytesRequest } from "./node";

// tslint:disable-next-line no-any
export interface Dictionary<TValue = any> {
    [key: string]: TValue;
}

export interface NoiaStreamDto {
    metadata: MasterResponse;
    getPiece(request: NodePieceRequest): Promise<PieceResult>;
    getBytes(request: NodeBytesRequest): Promise<Buffer>;
    getAllBytes(): Promise<Buffer>;
    bufferPieces(startingPieceIndex: number, numberOfPiecesToBuffer: number): void;
    bufferBytes(request: NodeBytesRequest): void;
}

export interface NoiaClient {
    openStream(dto: NoiaRequest): Promise<NoiaStreamDto>;
}
