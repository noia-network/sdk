import "../../sdk/dist/vendors~main";
import { NoiaClient, NoiaClientContainer } from "../../sdk";
// @ts-ignore
import * as PieceWorker from "worker-loader?inline=true&fallback=false!../../sdk/worker";
// @ts-ignore
import * as Sha1Worker from "worker-loader?inline=true&fallback=false!rusha/dist/rusha";

import { LoggerBuilder, LogLevel, ConsoleMessageHandler } from "simplr-logger";
import { bytesToBase64 } from "./base64";

const settings: { masterUrl?: string; log?: boolean } = {};

const logger = new LoggerBuilder({
    DefaultLogLevel: {
        LogLevel: LogLevel.Trace,
        LogLevelIsBitMask: false
    },
    WriteMessageHandlers: [
        {
            Handler: new ConsoleMessageHandler(),
            LogLevel:
                settings.log === true
                    ? LogLevel.Critical | LogLevel.Debug | LogLevel.Information | LogLevel.Error | LogLevel.Trace | LogLevel.Warning
                    : LogLevel.None,
            LogLevelIsBitMask: true
        }
    ]
});

const init = () => {
    NoiaClientContainer.initialize(
        new NoiaClient({
            masterUrl: typeof settings.masterUrl === "string" ? settings.masterUrl : "wss://csl-masters.noia.network:5566",
            logger: logger,
            pieceWorkerConstructor: () => new PieceWorker(),
            sha1WorkerConstructor: () => new Sha1Worker()
        })
    );
};

function load(): void {
    const images = document.getElementsByTagName("img");
    const imageType = "image/jpeg";
    const loadImage = async (img: HTMLImageElement): Promise<void> => {
        const imgDataSrc = img.getAttribute("data-src");
        if (imgDataSrc) {
            //@ts-ignore
            const stream = await window.NOIA.clientContainer.getClient().openStream({
                src: imgDataSrc
            });

            //Image came from CDN.
            if (stream.masterData.metadata) {
                // Load image bytes.
                const imageBytes = await stream.getAllBytes();
                // Render image as bytes.
                img.src = `data:${imageType};base64,${bytesToBase64(imageBytes)}`;
                logger.Info(`Image ${stream.masterData.src}: downloaded (${stream.masterData.metadata.bufferLength} bytes).`);
            } else {
                img.src = imgDataSrc;
                logger.Warn(`Image ${stream.masterData.src}: not found.`);
            }
        }
    };
    for (let i = 0; i < images.length; i++) {
        loadImage(images[i]);
    }
}

module.exports = { NOIA: { init, clientContainer: NoiaClientContainer, load, settings } };
