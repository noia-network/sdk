import { PoolPeer } from "./peers-pool";

export type PoolPeerReleaseHandler = (address: string) => void;

export abstract class PoolPeerBase implements PoolPeer {
    constructor(protected readonly address: string, protected readonly releasePeer: PoolPeerReleaseHandler) {}

    protected connected: boolean = false;
    protected destroyed: boolean = false;
    protected reserved: boolean = false;

    public isConnected(): boolean {
        return this.connected;
    }

    public isReserved(): boolean {
        this.ensureNotDestroyed();
        return this.reserved;
    }
    public reserve(): void {
        this.ensureNotDestroyed();
        if (this.reserved) {
            throw new Error("The peer is already reserved. Check before reserving.");
        }
        this.reserved = true;
    }
    public release(): void {
        this.ensureNotDestroyed();
        this.reserved = false;
        this.releasePeer(this.address);
    }
    public async destroy(): Promise<void> {
        this.onDestroy();
        this.destroyed = true;
    }

    public isDestroyed(): boolean {
        return this.destroyed;
    }

    protected ensureNotDestroyed(): void {
        if (this.destroyed) {
            throw new Error("Peer has already been destroyed.");
        }
    }

    protected onDestroy(): void {
        this.releasePeer(this.address);
    }
}
