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
    new webpack.EnvironmentPlugin(['NARO_AGROENV_STATIC_API_ENDPOINT']),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      util: require.resolve("util/")
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
  },
};
