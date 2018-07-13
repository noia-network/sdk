export interface PieceRequest {
    infoHash: string;
    piece: number;
    offset: number;
    length: number;
}

export interface NoiaNodeWorkerRequestData {
    pieceIndex: never;
    // tslint:disable-next-line:no-any
    blob: any;
}

export interface NoiaNodeWorkerRequestEvent extends MessageEvent {
    data: NoiaNodeWorkerRequestData;
}

export interface NoiaNodeWorkerData {
    index: number;
    infoHash: string;
    offset: number;
    // tslint:disable-next-line:no-any
    data: any;
}

export interface NoiaNodeWorkerEvent extends MessageEvent {
    data: NoiaNodeWorkerData;
}

export interface NodeResult {
    index: number;
    /**
     * Piece hash for integrity checking.
     */
    infoHash: string;
    offset: number;
    data: Buffer;
}
