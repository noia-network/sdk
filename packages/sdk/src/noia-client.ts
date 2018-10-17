import { LoggerBuilder, LogLevel } from "simplr-logger";
import { ConsoleMessageHandler } from "simplr-logger/handlers";
import { NodeClient } from "./clients/node";
import { MasterClient } from "./clients/master-client";
import { NoiaRequest, ConnectionType } from "./contracts/master";
import { NoiaStreamDto, NoiaClient as NoiaClientInterface } from "./contracts/sdk";
import { WebRtcPool } from "./clients/webrtc/webrtc-pool";
import { WebRtcClient } from "./clients/webrtc/webrtc-client";
import { WorkersPool } from "./workers/workers-pool";
import { DefaultWorker } from "./workers/default-worker";
import { NoiaStream } from "./noia-stream";
import { cache } from "./clients/pieces-cache";

export interface NoiaClientOptions {
    pieceWorkerConstructor: () => Worker;
    sha1WorkerConstructor: (id: string) => Worker;
    masterUrl?: string;
    logger?: LoggerBuilder;
}

const DEFAULT_MASTER_ADDRESS = "wss://csl-masters.noia.network:5566";
// const DEFAULT_MASTER_ADDRESS = "wss://blockchain.noia.network:5566";

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

        this.webRtcPool = new WebRtcPool({
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
    }

    protected readonly logger: LoggerBuilder;
    protected masterClient: MasterClient;
    protected webRtcPool: WebRtcPool;
    protected pieceWorkersPool: WorkersPool<DefaultWorker>;
    protected sha1WorkersPool: WorkersPool<DefaultWorker>;
    protected nodes: NodeClient[] = [];
    protected lastUsedNodeIndex: number = 0;

    public async openStream(request: NoiaRequest): Promise<NoiaStreamDto> {
        const metadata = await this.masterClient.getMetadata({
            src: request.src,
            connectionType: ConnectionType.WebRtc
        });

        const webRtcClient = new WebRtcClient({
            cache: cache,
            webRtcPool: this.webRtcPool,
            sha1Pool: this.sha1WorkersPool,
            metadata: metadata,
            src: request.src,
            logger: this.logger
        });

        return new NoiaStream({
            metadata: metadata,
            request: request,
            webRtcClient: webRtcClient,
            logger: this.logger
        });
    }
}
