const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const MONACO_DIR = path.resolve(__dirname, "./node_modules/monaco-editor");
const APP_DIR = path.resolve(__dirname, "./src");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index_bundle.js",
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      // For all .scss files that should be modularized. This should exclude
      // anything inside node_modules and everything inside src/assets/css
      // since they should be globally scoped.
      {
        test: /\.(scss)$/,
        exclude: [
          path.resolve(__dirname, "../node_modules"),
          path.resolve(__dirname, "../src/assets/css"),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]__[local]___[hash:base64:5]",
            },
          },
          "sass-loader",
        ],
        include: /\.module\.scss$/,
      },

      // for .scss modules that need to be available globally, we don't pass
      // the files through css-loader to be modularized.
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "resolve-url-loader", // add this before sass-loader
          "sass-loader",
          {
            loader: "sass-resources-loader",
            options: {
                resources: ["./src/assets/css/*.scss"],
            },
        }
        ],
        include: APP_DIR,
        exclude: /\.module\.scss$/,
      },
      {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(woff(2)?|png|jpe?g|jpg|gif|ttf)$/i,
        loader: "file-loader",
        options: {
          outputPath: "sdsds",
        },
      },
      {
        test: /\.html$/,
        use: [{ loader: "html-loader" }],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "./index.html",
    }),
    new CopyWebpackPlugin({ patterns: [{ from: "src/assets", to: "assets" }] }),
    new MiniCssExtractPlugin({
      filename: "[name].[contentHash].css",
    }),
    new MonacoWebpackPlugin({
      languages: ["javascript"],
    }),
  ],
};
