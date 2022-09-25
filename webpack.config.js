const path = require("path");

const isProduction = process.env.NODE_ENV == "production";
const nodeExternals = require("webpack-node-externals");

const config = {
    entry: "./src/server.ts",
    module: {
        rules: [
            {
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    target: "node",
    externals: [nodeExternals()],
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "server.js",
    },
};

module.exports = () => {
    if (isProduction) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }
    return config;
};
