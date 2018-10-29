export const enum ResultStatus {
    Success,
    Error
}

interface PiecesWorkerErrorMessage {
    status: ResultStatus.Error;
    error: string;
}
interface PiecesWorkerResultMessage<TData extends {} = {}> {
    status: ResultStatus.Success;
    data: TData;
}

export type PiecesWorkerMessage<TData extends {} = {}> = PiecesWorkerErrorMessage | PiecesWorkerResultMessage<TData>;

export interface Sha1WorkerMessage {
    id: string;
    hash: string;
}
