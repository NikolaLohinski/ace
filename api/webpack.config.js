const fs = require('fs');
module.exports = {
  entry: {
    'api.js': './api/api.js'
  },
  output: {
    path: require('path').resolve(__dirname, '..', 'dist', 'api'),
    filename: '[name]'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: [/node_modules/, /\.min.js$/],
        loader: 'eslint-loader'
      },
      {
        test: /\.(min.js)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: 'assets/[hash].[ext]'
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }
    ]
  },
  target: 'node',
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  externals: fs.readdirSync('node_modules').reduce(function (acc, mod) {
    if (mod === '.bin') {
      return acc;
    }
    acc[mod] = 'commonjs ' + mod;
    return acc;
  }, {})
};
