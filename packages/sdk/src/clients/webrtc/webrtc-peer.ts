import * as WebRtcDirectClient from "@noia-network/webrtc-direct-client";
import { PoolPeerBase, PoolPeerReleaseHandler } from "../../abstractions/pool-peer-base";
import { LoggerBuilder } from "simplr-logger";
import { Deferred } from "ts-deferred";

export interface WebRtcPeerOptions {
    address: string;
    releasePeer: PoolPeerReleaseHandler;
    clientConstructor: () => WebRtcDirectClient.Client;
    logger: LoggerBuilder;
}

export class WebRtcPeer extends PoolPeerBase {
    constructor(options: WebRtcPeerOptions) {
        super(options.address, options.releasePeer);

        this.logger = options.logger;
        this.clientConstructor = options.clientConstructor;

        this.connectDeferred = new Deferred<WebRtcDirectClient.Client>();
        this.connectDeferred.promise.then(() => {
            this.connected = true;
        });
    }

    protected logger: LoggerBuilder;
    protected clientConstructor: () => WebRtcDirectClient.Client;
    protected _client: WebRtcDirectClient.Client | undefined;
    protected connectDeferred: Deferred<WebRtcDirectClient.Client>;

    public release(): void {
        if (this._client != null) {
            this.resetEventListeners(this._client);
        }

        super.release();
    }

    public async connect(): Promise<WebRtcDirectClient.Client> {
        if (this._client == null) {
            this.logger.Debug("Constructing WebRTC client...");
            this._client = this.clientConstructor();

            this.logger.Debug("Resetting event listeners...");
            this.resetEventListeners(this._client);

            this.logger.Debug("Connecting...");
            await this._client.connect();
            this.logger.Debug("Connected.");
        }

        return this.connectDeferred.promise;
    }

    protected async onDestroy(): Promise<void> {
        if (this._client != null) {
            await this._client.stop();
        }
    }

    protected resetEventListeners(client: WebRtcDirectClient.Client): void {
        client.removeAllListeners();

        client.addListener("connected", () => {
            this.connectDeferred.resolve(client);
        });

        client.addListener("error", error => {
            // TODO: What should we do on error apart from logging it?
            this.logger.Error(error);
        });

        client.addListener("closed", () => {
            this.logger.Debug("Peer connection closed.", client);
            this.destroy();
        });
    }
}
