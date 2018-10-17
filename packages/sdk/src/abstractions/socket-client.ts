import { LoggerBuilder } from "simplr-logger";

export interface SocketClientOptions {
    address: string;
    logger: LoggerBuilder;
}

export class SocketClient {
    constructor(options: SocketClientOptions) {
        this.address = options.address;
        this.logger = options.logger;
        this.socket = new WebSocket(this.address);
    }

    protected readonly logger: LoggerBuilder;
    protected readonly address: string;
    protected socket: WebSocket;
    private socketPromise: Promise<WebSocket> | undefined;

    protected async connect(): Promise<WebSocket> {
        if (this.socketPromise != null) {
            return this.socketPromise;
        }

        const socketPromise = new Promise<WebSocket>((resolve, reject) => {
            // If socket is defined and open
            if (this.socket.readyState === WebSocket.OPEN) {
                resolve(this.socket);
                return;
            }

            this.socket.onopen = _ => {
                resolve(this.socket);
            };

            this.socket.onerror = () => {
                reject(`Connection to '${this.address}' has failed.`);
            };
        });

        this.socketPromise = socketPromise;

        return socketPromise;
    }
}
