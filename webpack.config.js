const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),

  },
  devServer: {
    static: './dist',
    open: true,
    hot: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    // expose and write the allowed env vars on the compiled bundle
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'manifest.json',
        },
        {
          from: 'service-worker.js',
        },
        {
          from: 'src/css',
          to: 'src/css',
        },
        {
          from: 'icons/',
          to: 'icons/',
        },
      ]}),
    new HtmlWebpackPlugin({
      title: 'Rentify',
      template: './src/pages/home.html',
      filename: 'home.html',
      templateParameters: {
        'manifest': './manifest.json',
      },
      chunks: ['./manifest.json'],
    }),

    new HtmlWebpackPlugin({
      title: 'Rentify',
      template: './index.html',
      templateParameters: {
        'foo': 'bar',
        'manifest': './manifest.json',
        'serviceworker': './service-worker.js',
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.js(x)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.('gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
}
