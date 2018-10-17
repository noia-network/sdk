import { LoggerBuilder } from "simplr-logger";
import { PoolWorkerBase, PoolWorkerReleaseHandler } from "../abstractions/pool-worker-base";

export interface DefaultWorkerOptions {
    worker: Worker;
    id: string;
    releaseWorker: PoolWorkerReleaseHandler;
    logger: LoggerBuilder;
}

export class DefaultWorker extends PoolWorkerBase {
    constructor(options: DefaultWorkerOptions) {
        super(options.id, options.releaseWorker);
        this.logger = options.logger;
        this.worker = options.worker;
    }

    protected logger: LoggerBuilder;
    public worker: Worker;
}
