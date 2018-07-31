import {
    NoiaClient as NoiaClientInterface,
    NoiaRequest,
    NoiaPieceRequest,
    Dictionary,
    NoiaPieceStartDto,
    NoiaStreamDto,
    FileInfo,
    PieceFromTorrentWithData
} from "./contracts";
import { SocketClient } from "./abstractions/socket-client";
import { NodeClient } from "./clients/node";
import { Deferred } from "ts-deferred";
import { MasterResponse, TorrentData } from "./contracts/master-client";
import { NodeResult, PieceRequest } from "./contracts/node-client";
import { NoiaEmitter } from "./noia-emitter";
import * as DetectRTC from "detectrtc";
import * as WebrtcDirectClient from "@noia-network/webrtc-direct-client";

const IPFS_PREFIX = "ipfs:";

interface RequestData {
    src: string;
    deferredResponse: Deferred<MasterResponse>;
    nodes?: NodeClient[];
    lastUsedNodeIndex: number;
    // deferredFallbackHead?: Deferred<any>;
}

export class NoiaClient extends SocketClient implements NoiaClientInterface {
    constructor(protected workerConstructor: () => Worker) {
        super("ws://167.99.220.73:6566");

        this.socket.addEventListener("message", event => {
            const response = JSON.parse(event.data) as MasterResponse;
            const src = response.src;
            const request = this.requests[src];
            request.deferredResponse.resolve(response);
        });
    }

    protected requests: Dictionary<RequestData> = {};
    protected nodes: NodeClient[] = [];
    protected lastUsedNodeIndex: number = 0;

    public async download(dto: NoiaRequest): Promise<Buffer> {
        const streamer = this.stream(dto);

        const result = new Promise<Buffer>(async (resolve, reject) => {
            // HTTP
            streamer.emitter.addListener("fileDone", buffer => {
                resolve(buffer);
            });

            // WebSockets
            const piecesPromises: Array<Promise<NodeResult>> = [];
            let fileInfo: FileInfo;

            streamer.emitter.addListener("pieceStart", pieceStartDto => {
                piecesPromises[pieceStartDto.index] = pieceStartDto.promise;
            });

            streamer.emitter.addListener("allPiecesStarted", async _ => {
                await Promise.all(piecesPromises);

                const buffer = new Buffer(fileInfo.contentLength);
                for (const piecePromise of piecesPromises) {
                    const pieceResult = await piecePromise;
                    if (pieceResult == null) {
                        continue;
                    }

                    for (let index = 0; index < pieceResult.data.length; index++) {
                        buffer[index + fileInfo.pieceLength * pieceResult.index] = pieceResult.data[index];
                    }
                }

                resolve(buffer);
            });

            // Wait for file info to arrive
            fileInfo = await streamer.emitter.fileInfo;
        });

        streamer.start();
        return result;
    }

    public stream(dto: NoiaRequest): NoiaStreamDto {
        const emitter = new NoiaEmitter();

        return {
            emitter: emitter,
            start: () => {
                this.startStream(dto, emitter);
            }
        };
    }

    protected async startStream(dto: NoiaRequest, emitter: NoiaEmitter): Promise<void> {
        emitter.emit("fileStart", {});
        const request = await this.ensureRequest(dto);

        // Wait for deferred response from socket
        const response = await request.deferredResponse.promise;

        emitter.emit("fileInfo", {
            contentLength: response.torrent.length,
            pieceLength: response.torrent.pieceLength,
            piecesCount: response.torrent.pieces != null ? response.torrent.pieces.length : 0
        } as FileInfo);

        const peers = Object.keys(response.peers);
        if (peers.length === 0) {
            // Fallback to original source
            console.debug("Fallback to original...");
            emitter.emit("fileStarted", {});
            emitter.emit("fileDone", await this.fallback(dto));
            return;
        }

        const torrent = response.torrent;
        console.debug(`Torrent has ${torrent.pieces.length} pieces.`);

        if (DetectRTC.isWebRTCSupported) {
            // console.info("WebRTC Supported");
            const address = "http://167.99.220.73:4545";
            await this.downloadPiecesFromWebRTC(address, torrent, emitter);
            return;
        }

        request.nodes = [];

        for (const peer of peers) {
            request.nodes.push(new NodeClient(`ws://${peer}`, this.workerConstructor));
        }

        console.debug(`Found ${peers.length} peers.`);
        const piecePromises: Array<Promise<NodeResult>> = [];
        for (let pieceIndex = 0; pieceIndex < torrent.pieces.length; pieceIndex++) {
            // Should never be undefined, because no nodes situation is handled above
            const node = this.nextNode(request)!;

            let length = torrent.pieceLength;
            if (pieceIndex === torrent.pieces.length - 1) {
                length = torrent.lastPieceLength;
            }

            const piecePromise = node.downloadPiece({
                infoHash: torrent.infoHash,
                piece: pieceIndex,
                offset: 0,
                length: length
            });
            const pieceStartDto: NoiaPieceStartDto = {
                index: pieceIndex,
                promise: piecePromise
            };
            emitter.emit("pieceStart", pieceStartDto);
            piecePromises.push(piecePromise);
        }

        emitter.emit("allPiecesStarted", {});
    }

    public async downloadPiecesFromWebRTC(webRtcNodeAddress: string, torrent: TorrentData, emitter: NoiaEmitter): Promise<void> {
        const piecesFromTorrent = this.generatePiecesFromTorrent(torrent);

        // Connect to webRTC
        const webrtcClient = new WebrtcDirectClient.Client(webRtcNodeAddress);
        await webrtcClient.connect();

        // Send all data
        let sendData: PieceRequest[] = [];
        webrtcClient.on("connected", async () => {
            console.info(`connected to ${webRtcNodeAddress} try to download ${torrent.infoHash}`);

            for (const pieceFromTorrent of piecesFromTorrent) {
                const msg = JSON.stringify(pieceFromTorrent);

                webrtcClient.send(msg);
                sendData.push(pieceFromTorrent);
            }
        });

        // Get all data
        let allData: PieceFromTorrentWithData[] = [];
        webrtcClient.on("data", async arrayBuffer => {
            const buffer = new Buffer(arrayBuffer);

            allData.push({
                msg: sendData[allData.length],
                buffer: buffer,
                arrayBuffer: arrayBuffer
            });
            if (allData.length === sendData.length) {
                await webrtcClient.stop();
                
                const buffer = new Buffer(torrent.length);
                for (const pieceResult of allData) {
                    if (pieceResult == null) {
                        continue;
                    }
                    const newPieceBuffer = pieceResult.buffer.slice(pieceResult.buffer.length - pieceResult.msg.length);

                    for (let index = 0; index < newPieceBuffer.length; index++) {
                        buffer[index + torrent.pieceLength * pieceResult.msg.piece] = newPieceBuffer[index];
                    }
                }

                emitter.emit("fileDone", buffer);
            }
        });
    }

    public generatePiecesFromTorrent(torrent: TorrentData): PieceRequest[] {
        let pieces: PieceRequest[] = [];
        for (let pieceIndex = 0; pieceIndex < torrent.pieces.length; pieceIndex++) {
            let length = torrent.pieceLength;
            if (pieceIndex === torrent.pieces.length - 1) {
                length = torrent.lastPieceLength;
            }

            let piece: PieceRequest = {
                infoHash: torrent.infoHash,
                offset: 0,
                piece: pieceIndex,
                length: length
            };
            pieces.push(piece);
        }
        return pieces;
    }

    public async downloadPiece(dto: NoiaPieceRequest): Promise<Buffer> {
        // await this.fallbackPiece(dto);
        throw new Error("Not implemented 24.");
        // return new Promise<Buffer>(async resolve => {
        //     let request = this.requests[dto.src];
        //     if (request != null) {
        //         return await request.promise;
        //     }

        //     const masterSocket = await this.connect();

        //     masterSocket.send(JSON.stringify(dto));
        // });
    }

    protected async ensureRequest(dto: NoiaRequest): Promise<RequestData> {
        let request = this.requests[dto.src];
        if (request == null) {
            request = {
                src: dto.src,
                deferredResponse: new Deferred<MasterResponse>(),
                lastUsedNodeIndex: 0
            };
            this.requests[dto.src] = request;
            const masterSocket = await this.connect();
            // Send request to master
            masterSocket.send(JSON.stringify(dto));
        }
        return request;
    }

    protected nextNode(request: RequestData): NodeClient | undefined {
        if (request.nodes == null || request.nodes.length === 0) {
            return undefined;
        }

        if (request.lastUsedNodeIndex >= request.nodes.length - 1) {
            request.lastUsedNodeIndex = 0;
        } else {
            request.lastUsedNodeIndex++;
        }

        return request.nodes[request.lastUsedNodeIndex];
    }

    protected async fallback(dto: NoiaRequest): Promise<Buffer> {
        let url = dto.src;

        if (url.startsWith(IPFS_PREFIX)) {
            const ipfsHash = url.substr(IPFS_PREFIX.length);
            url = `https://ipfs.infura.io/ipfs/${ipfsHash}`;
        }
        const fetchResult = await fetch(url);

        return new Buffer(await fetchResult.arrayBuffer());
    }

    protected async fallbackPiece(dto: NoiaPieceRequest, pieceLength = 16384): Promise<Buffer> {
        let url = dto.src;

        if (url.startsWith(IPFS_PREFIX)) {
            const ipfsHash = url.substr(IPFS_PREFIX.length);
            url = `https://ipfs.infura.io/ipfs/${ipfsHash}`;
        }

        // const request = new Request(`https://cors-anywhere.herokuapp.com/${url}`, {
        //     method: "HEAD",
        //     headers: {
        //         "Access-Control-Expose-Headers": "content-length"
        //     }
        // });
        // const headFetchResult = await fetch(request);
        // const contentLengthString = headFetchResult.headers.get("content-length");

        // if (contentLengthString == null) {
        //     throw new Error("Fallback request did not return content-length header.");
        // }

        // const contentLength = Number(contentLengthString);

        const fetchResult = await fetch(url, {
            headers: {
                // Range: "bytes=<START_RANGE>-<END_RANGE>/<TOTAL>"
                Range: `bytes=${dto.pieceIndex * pieceLength}-${(dto.pieceIndex + 1) * pieceLength - 1}`
            }
        });
        console.debug(fetchResult.headers);
        console.debug(fetchResult);
        console.debug(fetchResult.headers.get("content-length"));
        console.debug(await fetchResult.arrayBuffer());

        // var xhr = new XMLHttpRequest();

        // xhr.onreadystatechange = function() {
        //     if (xhr.readyState !== 4) {
        //         return;
        //     }
        //     console.log(this.getAllResponseHeaders());
        //     console.log(this.getResponseHeader("content-range"));
        // };

        // xhr.open("GET", url, true);
        // xhr.setRequestHeader("Range", "bytes=100-200"); // the bytes (incl.) you request
        // xhr.send(null);

        // TODO: Fix this...
        // tslint:disable-next-line no-any
        // return ((await fetchResult.arrayBuffer()) as any) as Buffer;
        throw new Error();
    }
}
