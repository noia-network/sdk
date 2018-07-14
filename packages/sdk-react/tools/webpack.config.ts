import { generateWebpackConfig } from "@simplrjs/webpack";

const config = generateWebpackConfig({
    emitHtml: false,
    projectDirectory: __dirname,
    entryFile: "./src/index.ts",
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

config.output.filename = "[name].js";
config.output.chunkFilename = "[name].js";

module.exports = config;
