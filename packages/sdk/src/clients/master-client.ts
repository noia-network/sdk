import { LoggerBuilder } from "simplr-logger";
import { Deferred } from "ts-deferred";

import { SocketClient } from "../abstractions/socket-client";
import { MasterResponse, MasterRequest, ConnectionType } from "../contracts/master";
import { Dictionary } from "../contracts/sdk";

export interface MasterClientOptions {
    masterAddress: string;
    logger: LoggerBuilder;
}

export class MasterClient extends SocketClient {
    constructor({ logger, masterAddress }: MasterClientOptions) {
        super({ logger: logger, address: masterAddress });
    }

    private masterPromise: Promise<WebSocket> | undefined;
    private deferredResponses: Dictionary<Deferred<MasterResponse>> = {};

    protected async connect(): Promise<WebSocket> {
        if (this.masterPromise == null) {
            this.logger.Debug("Connecting to master...");
            this.masterPromise = new Promise<WebSocket>(async (resolve, reject) => {
                const socket = await super.connect();
                socket.addEventListener("message", async message => this.handleMessage(message));
                this.logger.Debug("Connection to master established.");
                resolve(socket);
            });
        }

        return this.masterPromise;
    }

    protected async handleMessage(message: MessageEvent): Promise<void> {
        const masterResponse: MasterResponse = JSON.parse(message.data);

        // TODO: Check this.
        let isWebRtc = false;
        if (masterResponse.settings != null && masterResponse.settings.proxyControlAddress != null) {
            isWebRtc = true;
        }

        const connectionType = isWebRtc ? ConnectionType.WebRtc : ConnectionType.Wss;

        const key = `${connectionType}--${masterResponse.src}`.toLowerCase();

        const deferred = this.deferredResponses[key];

        if (deferred == null) {
            return;
        }

        const hosts = [
            // "169.56.115.248",
            // "191.232.192.222",
            "47.91.105.47",
            // "35.176.149.185",
            "52.200.129.174"
            ];

        const peers: Dictionary<string> = {};

        hosts.forEach(host => {
            peers[`${host}:8686`] = "";
        });

        // masterResponse.peers = { "94.200.9.2:8048": "", "59.10.195.31:8048": "", "169.56.115.248:8686": "" };
        masterResponse.peers = peers;

        deferred.resolve(masterResponse);
    }

    public async getMetadata(request: MasterRequest): Promise<MasterResponse> {
        const master = await this.connect();

        const key = `${request.connectionType}--${request.src}`.toLowerCase();

        // If deferred value already exists, return its promise.
        if (this.deferredResponses[key] != null) {
            return this.deferredResponses[key].promise;
        }

        const deferred = new Deferred<MasterResponse>();
        this.deferredResponses[key] = deferred;
        master.send(JSON.stringify(request));

        let timeoutTimer: NodeJS.Timer | undefined;
        const timeoutPromise = new Promise<null>(resolve => {
            timeoutTimer = setTimeout(() => resolve(null), 5000);
        });

        const response = await Promise.race([deferred.promise, timeoutPromise]);

        if (response == null) {
            const errorMessage = `Timeout while getting metadata from master for ${request.src}.`;
            deferred.reject(errorMessage);
            throw new Error(errorMessage);
        } else {
            // Clear timeout timer to not timeout the master response anymore.
            if (timeoutTimer != null) {
                clearTimeout(timeoutTimer);
            }
        }

        return deferred.promise;
    }
}
