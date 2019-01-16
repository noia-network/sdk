import { LoggerBuilder } from "simplr-logger";
import { Deferred } from "ts-deferred";

import { SocketClient } from "../abstractions/socket-client";
import { MasterResponse, MasterRequest, ConnectionType, MasterData, Peer, Ports } from "../contracts/master";
import { Dictionary } from "../contracts/sdk";

export interface MasterClientOptions {
    masterAddress: string;
    logger: LoggerBuilder;
}

export class MasterClient extends SocketClient {
    constructor({ logger, masterAddress }: MasterClientOptions) {
        super({ logger: logger, address: masterAddress });
    }

    private masterPromise: Promise<void> | undefined;
    private deferredResponses: Dictionary<Deferred<MasterData>> = {};

    protected async connect(): Promise<void> {
        if (this.masterPromise == null) {
            this.logger.Debug("Connecting to master...");
            this.masterPromise = new Promise<void>(async (resolve, _reject) => {
                await super.connect();
                this.addListener("message", async message => this.handleMessage(message));
                this.logger.Debug("Connection to master established.");
                resolve();
            });
        }

        return this.masterPromise;
    }

    protected generateKey(src: string, connectionType: ConnectionType): string {
        return `${connectionType}--${src}`.toLowerCase();
    }

    protected async handleMessage(message: MessageEvent): Promise<void> {
        const masterResponse: MasterResponse = JSON.parse(message.data);

        const masterData = masterResponse.data;

        if (masterResponse.status !== 200) {
            this.logger.Debug("masterResponse.status", masterResponse.status);
            return;
        }

        // Freeze object if freeze is supported.
        if (Object.freeze != null) {
            Object.freeze(masterData);
        }

        this.logger.Debug("masterResponse", masterData);
        this.logger.Debug("masterResponse.peers", masterData.peers);

        for (const peer of masterData.peers) {
            this.resolveMasterDataForConnectionType(peer, ConnectionType.WebRtc, masterData, this.deferredResponses);
            this.resolveMasterDataForConnectionType(peer, ConnectionType.Wss, masterData, this.deferredResponses);
            this.resolveMasterDataForConnectionType(peer, ConnectionType.Ws, masterData, this.deferredResponses);
        }
    }

    protected resolveMasterDataForConnectionType(
        peer: Peer,
        connectionType: ConnectionType,
        masterData: MasterData,
        deferredResponses: Dictionary<Deferred<MasterData>>
    ): void {
        const port = peer.ports[connectionType];

        if (port == null) {
            return;
        }

        const key = this.generateKey(masterData.src, connectionType);
        let response = deferredResponses[key];
        if (response == null) {
            response = new Deferred<MasterData>();
            deferredResponses[key] = response;
        }

        response.resolve(masterData);
    }

    public async getMetadata(request: MasterRequest): Promise<MasterData> {
        await this.connect();

        const deferred = new Deferred<MasterData>();
        for (const connectionType of request.connectionTypes) {
            const key = this.generateKey(request.src, connectionType);

            // If deferred value already exists, return its promise.
            if (this.deferredResponses[key] != null) {
                return this.deferredResponses[key].promise;
            }

            this.deferredResponses[key] = deferred;
        }

        this.socket.send(JSON.stringify(request));

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

    public async hasMetadata(src: string, connectionType: ConnectionType): Promise<boolean> {
        const key = this.generateKey(src, connectionType);
        const deferred = this.deferredResponses[key];

        if (deferred == null) {
            return false;
        }

        try {
            await deferred.promise;
            return true;
        } catch {
            return false;
        }
    }
}
