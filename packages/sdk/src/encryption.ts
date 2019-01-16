import * as CryptoJS from "crypto-js";

export class Encryption {
    private constructor() {}

    public static encrypt(key: string, buffer: Buffer): Buffer {
        const dataWordArray = CryptoJS.lib.WordArray.create(buffer);
        const cipherText = CryptoJS.AES.encrypt(dataWordArray, key);

        return Buffer.from(cipherText.toString());
    }

    public static decrypt(key: string, buffer: Buffer): Buffer {
        const cipherText = new TextDecoder("utf-8").decode(buffer);
        const bytes = CryptoJS.AES.decrypt(cipherText, key);
        const plainText = bytes.toString(CryptoJS.enc.Hex);
        const decryptedAB = Encryption.hexToArrayBuffer(plainText);
        // const decryptedBlob = Encryption.arrayBufferToBlob(decryptedAB);

        return Encryption.toBuffer(decryptedAB);
    }

    private static arrayBufferToBlob(data: ArrayBuffer): Blob {
        const uint8Array = new Uint8Array(data);
        const arrayBuffer = uint8Array.buffer;
        const blob = new Blob([arrayBuffer]);

        return blob;
    }

    private static hexToArrayBuffer(hex: string): ArrayBuffer {
        if (typeof hex !== "string") {
            throw new TypeError("Expected input to be a string");
        }
        if (hex.length % 2 !== 0) {
            throw new RangeError("Expected string to be an even number of characters");
        }
        const view = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }

        return view.buffer;
    }

    public static toBuffer(ab: ArrayBuffer): Buffer {
        const buf = new Buffer(ab.byteLength);
        const view = new Uint8Array(ab);

        for (let i = 0; i < buf.length; i++) {
            buf[i] = view[i];
        }

        return buf;
    }
}
