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
        new webpack.DefinePlugin({
            GITHUB_TOKEN: JSON.stringify(process.env.GITHUB_TOKEN),
            BACKLOG_API_KEY: JSON.stringify(process.env.BACKLOG_API_KEY),
        }),
    ],
}

module.exports = config
