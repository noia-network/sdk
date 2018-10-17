import * as WebRtcDirectClient from "@noia-network/webrtc-direct-client";
import { PeersPool, PeersPoolOptions } from "../../abstractions/peers-pool";
import { WebRtcPeer } from "./webrtc-peer";
import { PoolPeerReleaseHandler } from "../../abstractions/pool-peer-base";

export interface WebRtcPoolOptions {
    proxyControlAddress: string;
}

export class WebRtcPool extends PeersPool<WebRtcPeer, WebRtcPoolOptions> {
    constructor(options: PeersPoolOptions) {
        super(options);
    }

    private onReleasePeer: PoolPeerReleaseHandler = address => {
        this.releasePeer(address);
    };

    protected instantiatePeer(address: string, settings: WebRtcPoolOptions): WebRtcPeer {
        const webRtcClientConstructor = () => new WebRtcDirectClient.Client(address, { proxyAddress: settings.proxyControlAddress });
        return new WebRtcPeer({
            address: address,
            releasePeer: this.onReleasePeer,
            clientConstructor: webRtcClientConstructor,
            logger: this.logger
        });
    }
}
