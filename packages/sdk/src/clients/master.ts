import { SocketClient } from "../abstractions/socket-client";
import { FileData, MasterResponse } from "../contracts/master-client";
import { NodeResult } from "../contracts/node-client";
import { NodeClient } from "./node";

export class MasterClient extends SocketClient {
    constructor(masterAddress: string, protected workerConstructor: () => Worker) {
        super(masterAddress);
    }

    protected nodes: NodeClient[] = [];
    protected lastUsedNodeIndex: number = 0;

    public async download(fileData: FileData, logProgress: boolean = false): Promise<Buffer> {
        return new Promise<Buffer>(async resolve => {
            const masterSocket = await this.connect();

            masterSocket.onmessage = async message => {
                const buffer = await this.onMessage(message, logProgress);
                if (logProgress) {
                    console.info(`Resolving master promise...`);
                }
                resolve(buffer);
            };

            masterSocket.send(JSON.stringify(fileData));
        });
    }

    private async onMessage(message: MessageEvent, logProgress: boolean): Promise<Buffer> {
        const data: MasterResponse = JSON.parse(message.data);
        const { peers: peersObject, torrent } = data;
        const { infoHash } = torrent;

        const peers = Object.keys(peersObject);
        if (peers.length === 0) {
            throw new Error("No peers found.");
        }

        // #region WS
        for (const peer of peers) {
            this.addNode(`wss://${peer}`);
        }

        const promises: Array<Promise<NodeResult>> = [];
        const pieces: NodeResult[] = [];

        for (let pieceIndex = 0; pieceIndex < torrent.pieces.length; pieceIndex++) {
            const nodeClient = this.nextNode();
            if (nodeClient == null) {
                console.warn("Node client returned is not defined.");
                continue;
            }

            const promise = nodeClient.downloadPiece({
                infoHash: infoHash,
                piece: pieceIndex,
                offset: 0,
                length: torrent.pieceLength
            });
            if (logProgress) {
                setTimeout(async () => {
                    await promise;
                    console.info(`Finished downloading #${pieceIndex} piece.`);
                });
            }

            promises.push(promise);
        }
        //#endregion

        await Promise.all(promises);

        if (logProgress) {
            console.info(`All piece promises have been resolved. Constructing buffer...`);
        }

        for (const promise of promises) {
            const result = await promise;
            pieces[result.index] = result;
        }

        const buffer = new Buffer(torrent.length);
        for (const pieceResult of pieces) {
            if (pieceResult == null) {
                continue;
            }
            for (let index = 0; index < pieceResult.data.length; index++) {
                buffer[index + torrent.pieceLength * pieceResult.index] = pieceResult.data[index];
            }
        }
        if (logProgress) {
            console.info(`Buffer has been constructed: ${buffer.length} bytes`);
        }
        return buffer;
    }

    protected addNode(nodeAddress: string): void {
        const nodeClient = new NodeClient(nodeAddress, this.workerConstructor);
        this.nodes.push(nodeClient);
    }

    protected nextNode(): NodeClient | undefined {
        if (this.nodes.length === 0) {
            return undefined;
        }

        if (this.lastUsedNodeIndex >= this.nodes.length - 1) {
            this.lastUsedNodeIndex = 0;
        } else {
            this.lastUsedNodeIndex++;
        }

        return this.nodes[this.lastUsedNodeIndex];
    }
}
