import { LoggerBuilder } from "simplr-logger";
import { Dictionary } from "../contracts/sdk";
import { Pool } from "../contracts/pools";
import { Deferred } from "ts-deferred";

export interface PoolPeer {
    isReserved(): boolean;
    reserve(): void;
    release(): void;
    destroy(): Promise<void>;
    isDestroyed(): boolean;
    isConnected(): boolean;
}

export interface PeersPoolOptions {
    logger: LoggerBuilder;
}

export abstract class PeersPool<TPeer extends PoolPeer, TPeerSettings = never> implements Pool {
    constructor(options: PeersPoolOptions) {
        this.logger = options.logger;
    }

    protected readonly logger: LoggerBuilder;
    protected peers: Dictionary<TPeer> = {};
    protected filesToAddresses: Dictionary<string[] | undefined> = {};
    protected addressesToFiles: Dictionary<string[] | undefined> = {};

    protected peerReservationsQueues: Dictionary<Array<Deferred<TPeer>>> = {};

    protected abstract instantiatePeer(address: string, settings?: TPeerSettings): TPeer;

    public clearFilePeers(src: string): void {
        // TODO: Close peers on inactivity timeouts.
        if (this.filesToAddresses[src] != null) {
            this.filesToAddresses[src] = undefined;
        }
    }

    public addFilePeer(src: string, address: string, settings?: TPeerSettings): void {
        // Populate direct relation.
        if (this.peers[address] == null) {
            this.peers[address] = this.instantiatePeer(address, settings);
        }

        // Populate inverse relation.
        if (this.addressesToFiles[address] == null) {
            this.addressesToFiles[address] = [];
        }
        const files = this.addressesToFiles[address]!;
        if (files.indexOf(src) === -1) {
            files.push(src);
        }

        if (this.filesToAddresses[src] == null) {
            this.filesToAddresses[src] = [];
        }

        const addresses = this.filesToAddresses[src]!;
        addresses.push(address);
    }

    /**
     * @throws No peers were added for the file.
     * @param src File url or hash.
     */
    public async reserveAvailablePeer(src: string): Promise<TPeer> {
        const fileAddresses = this.filesToAddresses[src];
        if (fileAddresses == null || fileAddresses.length === 0) {
            throw new Error("No peers were added for the file.");
        }

        let result: TPeer | undefined = undefined;
        const keys = Object.keys(this.peers);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const peer = this.peers[key];
            // for (const address of fileAddresses) {
            // const peer = this.peers[address];
            if (peer.isReserved()) {
                continue;
            }
            peer.reserve();
            result = peer;
            break;
        }

        if (result != null) {
            return result;
        }

        const deferred = new Deferred<TPeer>();

        if (this.peerReservationsQueues[src] == null) {
            this.peerReservationsQueues[src] = [];
        }

        this.peerReservationsQueues[src].push(deferred);
        return deferred.promise;
    }

    public releasePeer(address: string): void {
        const files = this.addressesToFiles[address];
        if (files == null || files.length === 0) {
            return;
        }

        for (const src of files) {
            const deferredPromises = this.peerReservationsQueues[src];
            this.logger.Debug(`${src}:`, deferredPromises);
            if (deferredPromises == null || deferredPromises.length === 0) {
                continue;
            }

            const maybeDeferred = deferredPromises.shift();
            this.logger.Debug(`${src}:`, maybeDeferred);

            if (maybeDeferred == null) {
                continue;
            }

            this.logger.Debug(`${src}:`, maybeDeferred);

            const peer = this.peers[address];
            peer.reserve();

            maybeDeferred.resolve(peer);
            break;
        }
    }
}
