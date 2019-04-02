import { LoggerBuilder, LogLevel } from "simplr-logger";
import { ConsoleMessageHandler } from "simplr-logger/handlers";
import { MasterClient } from "./clients/master-client";
import { NoiaRequest, ConnectionType, MasterData } from "./contracts/master";
import { NoiaStreamDto, NoiaClient as NoiaClientInterface } from "./contracts/sdk";
import { WebRtcPool } from "./clients/webrtc/webrtc-pool";
import { WebRtcClient } from "./clients/webrtc/webrtc-client";
import { WorkersPool } from "./workers/workers-pool";
import { DefaultWorker } from "./workers/default-worker";
import { NoiaStream } from "./noia-stream";
import { cache } from "./clients/pieces-cache";
import { WebSocketClient } from "./clients/websocket/websocket-client";
import { WebSocketPool } from "./clients/websocket/websocket-pool";

export interface NoiaClientOptions {
    pieceWorkerConstructor: () => Worker;
    sha1WorkerConstructor: (id: string) => Worker;
    masterUrl?: string;
    logger?: LoggerBuilder;
}

const DEFAULT_MASTER_ADDRESS = "wss://csl-masters.noia.network:5566";
// const DEFAULT_MASTER_ADDRESS = "wss://blockchain.noia.network:6566";

export class NoiaClient implements NoiaClientInterface {
    constructor(options: NoiaClientOptions) {
        if (options.logger != null) {
            this.logger = options.logger;
        } else {
            this.logger = new LoggerBuilder({
                DefaultLogLevel: {
                    LogLevel: LogLevel.Trace,
                    LogLevelIsBitMask: false
                },
                WriteMessageHandlers: [
                    {
                        Handler: new ConsoleMessageHandler(),
                        LogLevel:
                            LogLevel.Critical | LogLevel.Debug | LogLevel.Information | LogLevel.Error | LogLevel.Trace | LogLevel.Warning,
                        // LogLevel.None,
                        LogLevelIsBitMask: true
                    }
                ]
            });
        }

        this.masterClient = new MasterClient({
            masterAddress: options.masterUrl || DEFAULT_MASTER_ADDRESS,
            logger: this.logger
        });

        this.pieceWorkersPool = new WorkersPool<DefaultWorker>({
            logger: this.logger,
            workerConstructor: (id: string) => {
                const constructedWorker = options.pieceWorkerConstructor();
                return new DefaultWorker({
                    logger: this.logger,
                    id: id,
                    releaseWorker: releaseId => {
                        this.pieceWorkersPool.releaseWorker(releaseId);
                    },
                    worker: constructedWorker
                });
            }
        });

        this.sha1WorkersPool = new WorkersPool<DefaultWorker>({
            logger: this.logger,
            workerConstructor: (id: string) => {
                const constructedWorker = options.sha1WorkerConstructor(id);
                return new DefaultWorker({
                    worker: constructedWorker,
                    id: id,
                    releaseWorker: releaseId => {
                        this.sha1WorkersPool.releaseWorker(releaseId);
                    },
                    logger: this.logger
                });
            }
        });

        this.webRtcPool = new WebRtcPool({
            logger: this.logger
        });

        this.webSocketPool = new WebSocketPool({
            logger: this.logger,
            piecesPool: this.pieceWorkersPool
        });
    }

    protected readonly logger: LoggerBuilder;
    protected masterClient: MasterClient;
    protected webRtcPool: WebRtcPool;
    protected webSocketPool: WebSocketPool;
    protected pieceWorkersPool: WorkersPool<DefaultWorker>;
    protected sha1WorkersPool: WorkersPool<DefaultWorker>;
    protected lastUsedNodeIndex: number = 0;

    public async openStream(request: NoiaRequest): Promise<NoiaStreamDto> {
        let masterData: MasterData;

        if (window != null && window.location != null) {
            request.src = new URL(request.src, window.location.href).href;
        }

        try {
            masterData = await this.masterClient.getMetadata({
                src: request.src,
                connectionTypes: [ConnectionType.WebRtc]
            });
        } catch (err) {
            // @ts-ignore
            masterData = { src: request.src };
        }

        const webRtcClient = new WebRtcClient({
            cache: cache,
            webRtcPool: this.webRtcPool,
            sha1Pool: this.sha1WorkersPool,
            masterData: masterData,
            src: request.src,
            logger: this.logger
        });

        const webSocketClient = new WebSocketClient({
            cache: cache,
            webSocketPool: this.webSocketPool,
            sha1Pool: this.sha1WorkersPool,
            masterData: masterData,
            piecesPool: this.pieceWorkersPool,
            src: request.src,
            logger: this.logger
        });

        return new NoiaStream({
            masterData: masterData,
            request: request,
            webRtcClient: webRtcClient,
            logger: this.logger,
            webSocketClient: webSocketClient,
            masterClient: this.masterClient
        });
    }
}
