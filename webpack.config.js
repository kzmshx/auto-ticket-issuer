const path = require("path")

const CopyPlugin = require("copy-webpack-plugin")
const dotenv = require("dotenv")
const Dotenv = require("dotenv-webpack")
const GasPlugin = require("gas-webpack-plugin")
const webpack = require("webpack")

dotenv.config()

const config = {
    mode: "development",
    devtool: "inline-source-map",
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
        new Dotenv({
            path: "./.env",
            safe: false,
            allowEmptyValues: false,
            systemvars: false,
            silent: false,
            defaults: true,
        }),
    ],
}

module.exports = config
