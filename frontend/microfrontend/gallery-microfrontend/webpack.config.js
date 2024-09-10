const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3003,
  },
  output: {
    publicPath: "auto",
  },
  devServer: {
    port: 3003,
    historyApiFallback: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "gallery",
      filename: "remoteEntry.js",
      exposes: {
        './AddPlacePopup': './src/components/AddPlacePopup.js',
        './Card': './src/components/Card.js',
        './ImagePopup': './src/components/ImagePopup.js',
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
