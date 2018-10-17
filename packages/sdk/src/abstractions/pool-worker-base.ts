import { PoolWorker } from "../workers/workers-pool";

export type PoolWorkerReleaseHandler = (id: string) => void;

export abstract class PoolWorkerBase implements PoolWorker {
    constructor(public id: string, protected readonly releaseWorker: PoolWorkerReleaseHandler) {}

    protected reserved: boolean = false;

    public isReserved(): boolean {
        return this.reserved;
    }
    public reserve(): void {
        this.reserved = true;
    }
    public release(): void {
        this.reserved = false;
        this.releaseWorker(this.id);
    }
}
