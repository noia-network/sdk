// import { EventEmitter } from "events";

// interface NoiaRequest {
//     src: string;
// }

// interface NoiaPieceRequest extends NoiaRequest {
//     pieceIndex: number;
// }

// interface NoiaEmitter extends EventEmitter {
//     addEventListener<TKey extends keyof NoiaClientEventMap>(
//         type: TKey,
//         listener: (this: NoiaEmitter, ev: NoiaClientEventMap[TKey], options?: boolean | {}) => void
//     ): void;
// }

// interface NoiaClient {
//     download(dto: NoiaRequest): Promise<Buffer>;
//     downloadPiece(dto: NoiaPieceRequest): Promise<Buffer>;
//     stream(dto: NoiaRequest): NoiaEmitter;
// }

// interface NoiaPieceDto {
//     pieceIndex: number;
//     data: Buffer;
// }

// interface NoiaClientEventMap {
//     piece: NoiaPieceDto;
// }

// const client: NoiaClient = new NoiaClient(masterAddress);
// const file = await client.download({
//     src: "ipfs:whateverhashyouhave"
// });

// const piece = await client.downloadPiece({
//     src: "ipfs:whateverhashyouhave",
//     pieceIndex: 12
// });

// const fileEmitter = client.stream({
//     src: "ipfs:whateverhashyouhave"
// });

// fileEmitter.addEventListener("piece", piece => {
//     const { pieceIndex, data } = piece;
// });

// function createCdnImage(): Promise<HTMLImageElement> {
//     const client: NoiaClient = new NoiaClient(masterAddress);
//     const img = document.createElement("img");
//     const file = await client.download({
//         src: "ipfs:whateverhashyouhave"
//     });

//     const type = "image/jpeg";
//     const bytes = arrayBufferToBase64(file);

//     img.src = `data:${type};base64,${bytes}`;

//     return img;
// }
