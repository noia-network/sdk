export class SocketClient {
    constructor(protected address: string) {
        this.socket = new WebSocket(this.address);
    }

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
