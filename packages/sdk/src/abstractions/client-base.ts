import { LoggerBuilder } from "simplr-logger";

import { MasterResponse } from "../contracts/master";
import { WorkersPool } from "../workers/workers-pool";
import { DefaultWorker } from "../workers/default-worker";
import { PiecesCache } from "../clients/pieces-cache";
import { NodePieceRequest, PieceResult } from "../contracts/node";

export interface ClientBaseOptions {
    src: string;
    metadata: MasterResponse;
    sha1Pool: WorkersPool<DefaultWorker>;
    cache: PiecesCache;
    logger: LoggerBuilder;
}

export abstract class ClientBase {
    constructor(options: ClientBaseOptions) {
        this.src = options.src;
        this.metadata = options.metadata;
        this.sha1Pool = options.sha1Pool;
        this.cache = options.cache;
        this.logger = options.logger;
    }

    protected readonly src: string;
    protected readonly sha1Pool: WorkersPool<DefaultWorker>;
    protected readonly logger: LoggerBuilder;
    protected readonly cache: PiecesCache;
    public readonly metadata: MasterResponse;

    protected ensurePeersPromise: Promise<void> | undefined;

    protected abstract ensurePeersHandler(): Promise<void>;
    protected abstract getPieceHandler(pieceRequest: NodePieceRequest): Promise<PieceResult>;

    public async ensurePeers(): Promise<void> {
        if (this.ensurePeersPromise != null) {
            return this.ensurePeersPromise;
        }

        const promise = this.ensurePeersHandler();
        this.ensurePeersPromise = promise;

        return promise;
    }

    public async getPiece(pieceRequest: NodePieceRequest): Promise<PieceResult> {
        await this.ensurePeers();

        if (this.cache.has(this.src, pieceRequest.piece)) {
            const result = await this.cache.get(this.src, pieceRequest.piece);
            if (result != null) {
                return result;
            }
        }

        const piecePromise = this.getPieceHandler(pieceRequest);
        this.cache.set(this.src, pieceRequest.piece, piecePromise);

        return piecePromise;
    }
}
