const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3002,
  },
  output: {
    publicPath: "auto",
  },
  devServer: {
    port: 3002,
    historyApiFallback: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "profile",
      filename: "remoteEntry.js",
      exposes: {
        './EditAvatarPopup': './src/components/EditAvatarPopup.js',
        './EditProfilePopup': './src/components/EditProfilePopup.js',
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};
