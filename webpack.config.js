const path = require('path');
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  target: ['web', 'es5'],
  entry: ['whatwg-fetch', './src/lib/index.ts'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.AGRO_ENV_STATIC_API_ENDPOINT': JSON.stringify(process.env.AGRO_ENV_STATIC_API_ENDPOINT || "https://agro-env.github.io/meteo-%s/%s/%s/%s.json"),
      'process.env.NODE_DEBUG': false
    }),
    new webpack.ProvidePlugin({
      Promise: 'es6-promise',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      util: require.resolve("util/")
    },
  },
  output: {
    filename: 'extract.js',
    path: path.resolve(__dirname, 'docs'),
  },
};
