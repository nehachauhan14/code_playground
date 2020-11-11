const path = require("path");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const APP_DIR = path.resolve(__dirname, "./src");
const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "public"),
  },
  mode: "development",
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.js$/,
        exclude: /node_modules/,
        query: {
          plugins: ["transform-object-assign"],
        },
      },
      {
        test: /\.css$/,
        include: APP_DIR,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: "file-loader",
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".css", ".js"],
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["json"],
    }),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({
      patterns: [{ from: "./src/assets", to: "assets" }],
    }),
  ],
};
