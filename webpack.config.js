const Webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
module.exports = {
  entry: {
    'app.js': './src/js/main.js'
  },
  output: {
    path: require('path').resolve(__dirname, 'out'),
    filename: '[name]'
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
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
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpg|svg|ttf|otf|min.js)$/,
        loader: 'file-loader',
        options: {
          name: '[hash].[ext]'
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
            removeComments: true,
            collapseWhitespace: true,
            attrs: ['link:href', 'script:src']
          },
        }]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: [/node_modules/],
        loader: 'vue-loader',
        options: {
          loaders: {
            scss: 'vue-style-loader!css-loader!sass-loader'
          }
        }
      }
    ]
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: './src/img/ace-logo.png',
      prefix: '',
      emitStats: false,
      statsFilename: '[hash].json',
      persistentCache: false,
      inject: true,
      background: '#f3f3f3',
      title: 'ACE'
    }),
    new HTMLWebpackPlugin({
      template: 'src/html/index.html',
      filename: 'index.html'
    }),
    // new CopyWebpackPlugin([
    //   { from: 'src/json/content.json' }
    // ]),
    new AppCachePlugin({
      network: ['*', '/check-connection'],
      output: 'cache.manifest'
    }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
};