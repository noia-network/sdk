import { Dictionary } from "../contracts/sdk";
import { PieceResult } from "../contracts/node";

const enum Status {
    InProgress,
    Resolved,
    Rejected
}

interface PieceStatus {
    promise: Promise<PieceResult>;
    status: Status;
}

export class PiecesCache {
    protected files: Dictionary<PieceStatus[]> = {};

    public set(src: string, index: number, promise: Promise<PieceResult>): void {
        if (this.files[src] == null) {
            this.files[src] = [];
        }

        const pieceStatus = {
            promise: promise,
            status: Status.InProgress
        };
        this.files[src][index] = pieceStatus;

        // Set status on promise resolve/reject
        promise.then(() => (pieceStatus.status = Status.Resolved)).catch(() => (pieceStatus.status = Status.Rejected));
    }

    public async get(src: string, index: number): Promise<PieceResult | undefined> {
        if (this.files[src] == null) {
            return undefined;
        }

        return this.files[src][index].promise;
    }

    public has(src: string, index: number): boolean {
        if (this.files[src] == null) {
            return false;
        }

        const pieceStatus = this.files[src][index];
        return pieceStatus != null && pieceStatus.status !== Status.Rejected;
    }
}

export const cache = new PiecesCache();
