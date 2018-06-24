const Webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const AppCachePlugin = require('appcache-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const TransformModulesPlugin = require('webpack-transform-modules-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: {
    'app.js': './src/js/main.js'
  },
  output: {
    path: require('path').resolve(__dirname, 'dist'),
    filename: '[name]'
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.common.js',
      'cube-ui': 'cube-ui/lib'
    }
  },
  devServer: {
    port: 8080,
    compress: true,
    stats: 'errors-only'
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
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|otf|min.js)(\?.*$|$)/,
        loader: 'file-loader',
        options: {
          name: 'assets/[hash].[ext]'
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
          }
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
    new TransformModulesPlugin(),
    new FaviconsWebpackPlugin({
      logo: './src/img/ace-logo.png',
      prefix: 'assets/',
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
    new AppCachePlugin({
      output: 'cache.manifest'
    }),
    new Webpack.DefinePlugin({
      '__VERSION__': JSON.stringify(require('./package.json').version)
    }),
    new CopyWebpackPlugin([
      { from: 'README_master.md', to: 'README.md' }
    ])
  ]
};