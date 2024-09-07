const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  devServer: {
    port: 3001,
  },
  output: {
    publicPath: "auto",
  },
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },

  plugins: [
    new ModuleFederationPlugin({
      name: "auth",
      filename: "remoteEntry.js",
      exposes: {
        './Login': './src/components/Login.js',
        './Register': './src/components/Register.js',
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
    // new HtmlWebpackPlugin({
    //   template: "./public/index.html",
    // }),
  ],
};
