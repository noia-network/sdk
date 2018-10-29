import { ResultStatus, PiecesWorkerMessage } from "../contracts/worker";
import { protoJson } from "../clients/proto";
import { ContentResponse } from "@noia-network/protocol";
import * as protobuf from "protobufjs";
import { PieceResult } from "../contracts/node";

// tslint:disable-next-line:no-any
const ctx = (self as any) as Worker;
const root = protobuf.Root.fromJSON(protoJson);
const contentResponseProtobuf = root.lookupType("ContentResponse");

function postMessage(message: PiecesWorkerMessage<PieceResult>): void {
    ctx.postMessage(message);
}

function decodeData(data: ArrayBuffer): ContentResponse {
    // tslint:disable-next-line:no-any
    return (contentResponseProtobuf.decode(new Uint8Array(data)) as any) as ContentResponse;
}

// Respond to message from parent thread
addEventListener("message", async event => {
    const blob = event.data.blob;
    const reader = new FileReader();

    async function onLoadEnd(e: ProgressEvent): Promise<void> {
        reader.removeEventListener("loadend", onLoadEnd, false);
        if (reader.result == null) {
            ctx.postMessage({
                status: ResultStatus.Error
            });
            return;
        }

        let arrayBuffer: ArrayBuffer;
        if (reader.result instanceof ArrayBuffer) {
            arrayBuffer = reader.result;
        } else if (typeof reader.result !== "string") {
            const buffer = Buffer.from(reader.result);
            // ArrayBuffer
            arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        } else {
            postMessage({
                status: ResultStatus.Error,
                error: "Unknown data type received."
            });
            return;
        }

        const content = decodeData(arrayBuffer);
        if (content.status !== 200 || content.data == null) {
            postMessage({
                status: ResultStatus.Error,
                error: content.error || "Incorrect data received."
            });
            return;
        }

        const responseData = content.data;
        postMessage({
            status: ResultStatus.Success,
            data: {
                contentId: responseData.contentId,
                index: responseData.index,
                offset: responseData.offset,
                buffer: responseData.buffer
            }
        });
        // const pieceIndex = arrayBuffer.readUInt32BE(0);
        // const offset = arrayBuffer.readUInt32BE(0 + 4);
        // const infoHash = arrayBuffer.toString("hex", 4 + 4, 24 + 4);
        // const data = arrayBuffer.slice(24 + 4, arrayBuffer.length);

        // ctx.postMessage({
        //     index: pieceIndex,
        //     infoHash: infoHash,
        //     offset: offset,
        //     data: data,
        //     status: ResultStatus.Success
        // });
    }

    reader.addEventListener("loadend", onLoadEnd, false);
    reader.readAsArrayBuffer(blob);
});
