import { SocketClient } from "../abstractions/socket-client";

export class NodeClient extends SocketClient {
    public async connect(): Promise<void> {
        return super.connect();
    }

    public sendJson(data: unknown): void {
        this.socket.send(JSON.stringify(data));
    }
}
