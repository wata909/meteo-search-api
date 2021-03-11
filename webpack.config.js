const path = require('path');
const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: './src/lib/index.ts',
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
      'process.env.AGRO_ENV_STATIC_API_ENDPOINT': JSON.stringify(process.env.AGRO_ENV_STATIC_API_ENDPOINT),
      'process.env.NODE_DEBUG': false
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      util: require.resolve("util/")
    }
  },
  output: {
    filename: 'extract.js',
    path: path.resolve(__dirname, 'cdn'),
  },
};
