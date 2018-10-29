import { LoggerBuilder } from "simplr-logger";

import { MasterData } from "../contracts/master";
import { WorkersPool } from "../workers/workers-pool";
import { DefaultWorker } from "../workers/default-worker";
import { PiecesCache } from "../clients/pieces-cache";
import { NodePieceRequest, PieceResult } from "../contracts/node";
import { ContentResponse } from "@noia-network/protocol";
import { Deferred } from "ts-deferred";
import * as protobuf from "protobufjs";

export interface ClientBaseOptions {
    src: string;
    masterData: MasterData;
    sha1Pool: WorkersPool<DefaultWorker>;
    cache: PiecesCache;
    logger: LoggerBuilder;
}

export abstract class ClientBase {
    constructor(options: ClientBaseOptions) {
        this.src = options.src;
        this.masterData = options.masterData;
        this.sha1Pool = options.sha1Pool;
        this.cache = options.cache;
        this.logger = options.logger;
    }

    protected readonly src: string;
    protected readonly sha1Pool: WorkersPool<DefaultWorker>;
    protected readonly logger: LoggerBuilder;
    protected readonly cache: PiecesCache;
    public readonly masterData: MasterData;

    protected ensurePeersPromise: Promise<void> | undefined;

    private protobufTypeDeferred: Deferred<protobuf.Type> | undefined;

    protected abstract ensurePeersHandler(): Promise<void>;
    protected abstract getPieceHandler(pieceRequest: NodePieceRequest): Promise<PieceResult>;
    protected abstract getProtoJson(): {};

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

        if (this.cache.has(this.src, pieceRequest.index)) {
            const result = await this.cache.get(this.src, pieceRequest.index);
            if (result != null) {
                return result;
            }
        }

        const piecePromise = this.getPieceHandler(pieceRequest);
        this.cache.set(this.src, pieceRequest.index, piecePromise);

        return piecePromise;
    }

    protected async getProtobufType(): Promise<protobuf.Type> {
        if (this.protobufTypeDeferred != null) {
            return this.protobufTypeDeferred.promise;
        }
        this.logger.Debug("==================================");
        // this.logger.Debug(`@noia-network/protocol/${Wire.getProtoFilePath()}`);
        this.protobufTypeDeferred = new Deferred<protobuf.Type>();
        const root = protobuf.Root.fromJSON(this.getProtoJson());
        this.logger.Debug("root", root);
        const result = root.lookupType("ContentResponse");

        this.protobufTypeDeferred.resolve(result);

        return this.protobufTypeDeferred.promise;
    }

    protected async decodeData(data: ArrayBuffer): Promise<ContentResponse> {
        this.logger.Debug("Getting protobuf.Type...");
        const contentResponseProtobuf = await this.getProtobufType();
        this.logger.Debug("Getting protobuf.Type... Done.");
        // tslint:disable-next-line:no-any
        const content: ContentResponse = contentResponseProtobuf.decode(new Uint8Array(data)) as any;
        return content;
    }
}
