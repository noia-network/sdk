import { generateWebpackConfig } from "@simplrjs/webpack";

const config = generateWebpackConfig({
    emitHtml: false,
    projectDirectory: __dirname,
    entryFile: "./src/main.ts",
    outputDirectory: "dist",
    target: "web"
});

config.output = {
    ...config.output,
    libraryTarget: "commonjs"
};

config.module = config.module || {
    rules: []
};

// config.entry = {
//     main: "./src/index.ts",
//     worker: "./src/clients/pieces.worker.ts"
// };

config.output.filename = "[name].js";
config.output.chunkFilename = "[name].js";

module.exports = config;
