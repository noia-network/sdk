import { LoggerBuilder } from "simplr-logger";
import { Deferred } from "ts-deferred";

import { PoolPeerBase, PoolPeerReleaseHandler } from "../../abstractions/pool-peer-base";
import { NodeClient } from "../node-client";

export interface WebSocketPeerOptions {
    address: string;
    clientConstructor: () => NodeClient;
    releasePeer: PoolPeerReleaseHandler;
    logger: LoggerBuilder;
}

export class WebSocketPeer extends PoolPeerBase {
    constructor(options: WebSocketPeerOptions) {
        super(options.address, options.releasePeer);

        this.logger = options.logger;
        this.clientConstructor = options.clientConstructor;
        this.connectDeferred = new Deferred<NodeClient>();
        this.connectDeferred.promise.then(() => {
            this.connected = true;
        });
    }

    protected logger: LoggerBuilder;
    protected clientConstructor: () => NodeClient;
    protected client: NodeClient | undefined;
    protected connectDeferred: Deferred<NodeClient>;

    public release(): void {
        if (this.client != null) {
            this.resetEventListeners(this.client);
        }

        super.release();
    }

    public async connect(): Promise<NodeClient> {
        if (this.client == null) {
            this.logger.Debug("Constructing WebSocket client...");
            this.client = this.clientConstructor();

            this.logger.Debug("Resetting event listeners...");
            this.resetEventListeners(this.client);

            this.logger.Debug("Connecting...");
            await this.client.connect();
            this.logger.Debug("Connected.");
        }

        return this.connectDeferred.promise;
    }

    protected resetEventListeners(client: NodeClient): void {
        client.removeAllListeners();

        client.addListener("open", () => {
            this.connectDeferred.resolve(client);
        });

        client.addListener("error", error => {
            // TODO: What should we do on error apart from logging it?
            this.logger.Error(error);
        });

        client.addListener("close", () => {
            this.logger.Debug("Peer connection closed.", client);
            this.destroy();
        });
    }
}
