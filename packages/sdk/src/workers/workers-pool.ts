import { LoggerBuilder } from "simplr-logger";
import { Deferred } from "ts-deferred";
import { Dictionary } from "../contracts/sdk";
import * as shortid from "shortid";

export interface PoolWorker {
    id: string;
    isReserved(): boolean;
    reserve(): void;
    release(): void;
}

export interface WorkerPoolOptions<TWorker extends PoolWorker> {
    workerConstructor: (id: string) => TWorker;
    logger: LoggerBuilder;
}

const NUMBER_OF_CORES = (window != null && window.navigator != null && window.navigator.hardwareConcurrency) || 4;

export class WorkersPool<TWorker extends PoolWorker = PoolWorker> {
    constructor(options: WorkerPoolOptions<TWorker>) {
        this.workerConstructor = options.workerConstructor;
        this.logger = options.logger;

        this.workers = {};
    }

    protected readonly workerConstructor: (id: string) => TWorker;
    protected readonly logger: LoggerBuilder;

    protected initiateWorkersPromise: Promise<void> | undefined;
    protected readonly workers: Dictionary<TWorker>;
    protected readonly workersReservationsQueues: Array<Deferred<TWorker>> = [];

    protected async initiateWorkers(): Promise<void> {
        for (let index = 0; index < NUMBER_OF_CORES; index++) {
            const id = index.toString();
            this.workers[id] = this.workerConstructor(id);
        }
    }

    /**
     * @throws No workers were initiated.
     * @param src File url or hash.
     */
    public async reserveAvailableWorker(): Promise<TWorker> {
        if (this.initiateWorkersPromise == null) {
            this.initiateWorkersPromise = this.initiateWorkers();
        }

        try {
            await this.initiateWorkersPromise;
        } catch (err) {
            throw new Error("No workers were initiated");
        }

        let result: TWorker | undefined = undefined;
        const keys = Object.keys(this.workers);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const worker = this.workers[key];

            this.logger.Debug(`Is reserved? #${i}, ${key}`);

            if (worker.isReserved()) {
                this.logger.Debug(`Yep. #${i}, ${key}`);
                continue;
            }

            this.logger.Debug(`No! #${i}, ${key}`);
            worker.reserve();
            result = worker;
            break;
        }

        if (result != null) {
            return result;
        }

        const deferred = new Deferred<TWorker>();

        this.workersReservationsQueues.push(deferred);
        return deferred.promise;
    }

    public releaseWorker(id: string): void {
        if (this.workersReservationsQueues.length === 0) {
            return;
        }

        const maybeDeferred = this.workersReservationsQueues.shift();
        if (maybeDeferred == null) {
            return;
        }

        maybeDeferred.resolve(this.workers[id]);
    }
}
