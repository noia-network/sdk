export const enum ResultStatus {
    Success,
    Error
}

export interface Sha1WorkerMessage {
    id: string;
    hash: string;
}
