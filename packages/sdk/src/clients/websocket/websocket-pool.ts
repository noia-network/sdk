import { PeersPool, PeersPoolOptions } from "../../abstractions/peers-pool";
import { PoolPeerReleaseHandler } from "../../abstractions/pool-peer-base";
import { WebSocketPeer } from "./websocket-peer";
import { WorkersPool } from "../../workers/workers-pool";
import { DefaultWorker } from "../../workers/default-worker";
import { NodeClient } from "../node-client";

export interface WebRtcPoolOptions extends PeersPoolOptions {
    piecesPool: WorkersPool<DefaultWorker>;
}

export class WebSocketPool extends PeersPool<WebSocketPeer> {
    constructor(options: WebRtcPoolOptions) {
        super(options);

        this.piecesPool = options.piecesPool;
    }

    protected readonly piecesPool: WorkersPool<DefaultWorker>;

    private onReleasePeer: PoolPeerReleaseHandler = address => {
        this.releasePeer(address);
    };

    protected instantiatePeer(address: string): WebSocketPeer {
        const clientConstructor = () => {
            this.logger.Debug(`Instantiating websocket connection to ${address}...`);
            return new NodeClient({ address: address, logger: this.logger });
        };
        return new WebSocketPeer({
            address: address,
            clientConstructor: clientConstructor,
            releasePeer: this.onReleasePeer,
            logger: this.logger
        });
    }
}
