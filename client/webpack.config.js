const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  devtool: "source-map",
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    overlay: true,
    port: 9000,
    hot: true,
    open: true
  },
  // mode: 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            //  // Compiles Sass to CSS
            // 'sass-loader',
          ],
        },
        {
          test: /\.(json)$/,
          use: "json-loader"
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg|png|jpeg|webp|jpg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                esModule: false,
                outputPath: 'fonts/'
              }
            }
          ]
        },
      ],
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebpackPlugin({
          template: "./public/index.html",
          filename: "./index.html",
          favicon: "./public/favicon.ico"
        }),
        new webpack.HotModuleReplacementPlugin()
      ],
      watch: true
  };