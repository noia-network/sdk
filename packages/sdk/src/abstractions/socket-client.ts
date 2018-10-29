import { LoggerBuilder } from "simplr-logger";
import StrictEventEmitter from "strict-event-emitter-types";
import { EventEmitter } from "events";

export interface SocketClientOptions {
    address: string;
    logger: LoggerBuilder;
}

const SettingsScopeEmitter: { new (): StrictEventEmitter<EventEmitter, WebSocketEventMap> } = EventEmitter;

export class SocketClient extends SettingsScopeEmitter {
    constructor(options: SocketClientOptions) {
        super();
        this.address = options.address;
        this.logger = options.logger;
        this.socket = new WebSocket(this.address);

        this.socket.addEventListener("error", event => this.emit("error", event));
        this.socket.addEventListener("open", event => this.emit("open", event));
        this.socket.addEventListener("close", event => this.emit("close", event));
        this.socket.addEventListener("message", event => this.emit("message", event));
    }

    protected readonly logger: LoggerBuilder;
    protected readonly address: string;
    protected socket: WebSocket;
    private socketPromise: Promise<void> | undefined;

    protected async connect(): Promise<void> {
        if (this.socketPromise != null) {
            return this.socketPromise;
        }

        const socketPromise = new Promise<void>((resolve, reject) => {
            // If socket is defined and open
            if (this.socket.readyState === WebSocket.OPEN) {
                resolve();
                return;
            }

            this.once("open", () => {
                resolve();
            });

            this.once("error", () => {
                reject(`Connection to '${this.address}' has failed.`);
            });
        });

        this.socketPromise = socketPromise;

        return socketPromise;
    }
}
