const path = require("path")

const CopyPlugin = require("copy-webpack-plugin")
const dotenv = require("dotenv")
const GasPlugin = require("gas-webpack-plugin")
const webpack = require("webpack")

dotenv.config()

const config = {
    mode: "production",
    entry: {
        main: path.join(__dirname, "src/main.ts"),
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts"],
    },
    plugins: [
        new GasPlugin(),
        new CopyPlugin({
            patterns: [{ from: path.join(__dirname, "src/appsscript.json") }],
        }),
        new webpack.EnvironmentPlugin([
            "BACKLOG_API_KEY",
            "GITHUB_TARGET_LABEL_NAME",
            "GITHUB_TARGET_REPOSITORY_OWNER_ID",
            "GITHUB_TOKEN",
        ]),
    ],
}

module.exports = config
