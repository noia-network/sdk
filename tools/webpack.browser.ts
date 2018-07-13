import { generateWebpackConfig } from "@simplrjs/webpack";

const config = generateWebpackConfig({
    emitHtml: true,
    projectDirectory: __dirname,
    entryFile: "./src/browser.ts",
    outputDirectory: "dist_browser",
    target: "web",
    devServerPort: 49120
});

module.exports = config;
