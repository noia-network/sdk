import { LoggerBuilder } from "simplr-logger";
import { PeersPool, PoolPeer } from "../peers-pool";
import { Dictionary } from "../../contracts/sdk";

class MyNode implements PoolPeer {
    constructor(protected $address: string) {}

    public get address(): string {
        return this.$address;
    }

    protected reserved: boolean = false;
    public isReserved(): boolean {
        return this.reserved;
    }

    public reserve(): void {
        this.reserved = true;
    }

    public release(): void {
        this.reserved = false;
    }

    public async destroy(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public isDestroyed(): boolean {
        throw new Error("Method not implemented.");
    }
    public isConnected(): boolean {
        throw new Error("Method not implemented.");
    }
}

class TestPool extends PeersPool<MyNode> {
    constructor() {
        super({
            logger: new LoggerBuilder()
        });
    }

    public instantiatePeer(address: string): MyNode {
        return new MyNode(address);
    }

    public getNodes(): Dictionary<MyNode> {
        return this.peers;
    }

    public getFilesToAddresses(): Dictionary<string[] | undefined> {
        return this.filesToAddresses;
    }
}

test("addFileNodes registers addresses properly", () => {
    const pool = new TestPool();
    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";
    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    const nodes = pool.getNodes();
    const nodesKeys = Object.keys(nodes);
    expect(nodesKeys.indexOf(nodeAddress1)).not.toBe(-1);
    expect(nodesKeys.indexOf(nodeAddress2)).not.toBe(-1);

    const filesToAddresses = pool.getFilesToAddresses();
    expect(filesToAddresses[src]).toBeDefined();
});

it("should throw while getting reserveAvailablePeer with no nodes", async () => {
    const pool = new TestPool();

    const src = "file-path";

    expect(pool.reserveAvailablePeer(src)).rejects.toThrowError();
});

it("should return next node", async () => {
    const pool = new TestPool();

    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";
    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    const nextPeer = await pool.reserveAvailablePeer(src);
    expect(nextPeer).toBeDefined();
});

it("should reserve next node", async () => {
    const pool = new TestPool();

    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";
    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    const nextPeer = await pool.reserveAvailablePeer(src);
    expect(nextPeer).toBeDefined();
    expect(nextPeer.isReserved()).toBe(true);
});

it("should release node", async () => {
    const pool = new TestPool();

    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";
    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    const nextPeer = await pool.reserveAvailablePeer(src);
    expect(nextPeer).toBeDefined();
    expect(nextPeer.isReserved()).toBe(true);

    nextPeer.release();

    expect(nextPeer.isReserved()).toBe(false);
});

it("should reserve all nodes", async () => {
    const pool = new TestPool();

    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";
    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    const nextPeer1 = await pool.reserveAvailablePeer(src);
    expect(nextPeer1).toBeDefined();
    expect(nextPeer1.address).toBe(nodeAddress1);

    const nextPeer2 = await pool.reserveAvailablePeer(src);
    expect(nextPeer2).toBeDefined();
    expect(nextPeer2.address).toBe(nodeAddress2);
});

it("should not reserve node when all nodes are reserved", async () => {
    const pool = new TestPool();

    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";

    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    await pool.reserveAvailablePeer(src);
    await pool.reserveAvailablePeer(src);

    const noPeer = pool.reserveAvailablePeer(src);
    expect(noPeer).rejects.toThrowError();
});

it("should clear filesToPeers", async () => {
    const pool = new TestPool();

    const src = "file-path";
    const nodeAddress1 = "node-path-1";
    const nodeAddress2 = "node-path-2";

    pool.addFilePeer(src, nodeAddress1);
    pool.addFilePeer(src, nodeAddress2);

    await pool.reserveAvailablePeer(src);

    pool.clearFilePeers(src);

    const noPeer = pool.reserveAvailablePeer(src);
    expect(noPeer).rejects.toThrowError();
});
