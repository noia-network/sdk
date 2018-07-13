// tslint:disable-next-line:no-any
const ctx = (self as any) as Worker;

// Respond to message from parent thread
addEventListener("message", event => {
    const blob = event.data.blob;
    const reader = new FileReader();

    async function onLoadEnd(e: ProgressEvent): Promise<void> {
        reader.removeEventListener("loadend", onLoadEnd, false);
        const buffer = Buffer.from(reader.result);
        const pieceIndex = buffer.readUInt32BE(0);
        const offset = buffer.readUInt32BE(0 + 4);
        const infoHash = buffer.toString("hex", 4 + 4, 24 + 4);
        const data = buffer.slice(24 + 4, buffer.length);

        ctx.postMessage({
            index: pieceIndex,
            infoHash: infoHash,
            offset: offset,
            data: data
        });
    }

    reader.addEventListener("loadend", onLoadEnd, false);
    reader.readAsArrayBuffer(blob);
});
