import "../../sdk/dist/vendors~main";
import { NoiaClient, NoiaClientContainer } from "../../sdk";
// @ts-ignore
import * as PieceWorker from "worker-loader?inline=true&fallback=false!../../sdk/worker";
// @ts-ignore
import * as Sha1Worker from "worker-loader?inline=true&fallback=false!rusha/dist/rusha";
import { Settings } from "settings";
import { bytesToBase64 } from "./base64";

const settings = new Settings(false);

const init = () => {
    NoiaClientContainer.initialize(
        new NoiaClient({
            masterUrl: settings.masterUrl,
            logger: settings.getLogger(),
            pieceWorkerConstructor: () => new PieceWorker(),
            sha1WorkerConstructor: () => new Sha1Worker()
        })
    );
};

const load = (): void => {
    const images = document.getElementsByTagName("img");
    const loadImage = async (img: HTMLImageElement): Promise<void> => {
        const imageType = img.getAttribute("data-src")!.endsWith(".svg") ? "image/svg+xml" : "image/jpg";
        const imgDataSrc = img.getAttribute("data-src");
        if (imgDataSrc) {
            //@ts-ignore
            const client = window.NOIA.clientContainer.getClient();
            const stream = await client.openStream({
                src: imgDataSrc
            });
            if (window.navigator.userAgent.indexOf("Edge") > -1 === true || window.navigator.userAgent.indexOf("MSIE") > -1 === true) {
                img.src = img.getAttribute("data-src")!.replace("data-src", "src");
            } else {
                // Image came from CDN.
                if (stream.masterData.metadata) {
                    // Load image bytes.
                    const imageBytes = await stream.getAllBytes();
                    // Render image as bytes.
                    const blob = new Blob([imageBytes], { type: imageType });
                    const blobUrl = URL.createObjectURL(blob);
                    img.src = blobUrl;
                    settings
                        .getLogger()
                        .Info(`Image ${stream.masterData.src}: downloaded (${stream.masterData.metadata.bufferLength} bytes).`);
                } else {
                    img.src = imgDataSrc;
                    settings.getLogger().Warn(`Image ${stream.masterData.src}: not found.`);
                }
            }
        }
    };

    for (let i = 0; i < images.length; i++) {
        loadImage(images[i]);
    }
};

module.exports = { NOIA: { init, clientContainer: NoiaClientContainer, load, settings } };
