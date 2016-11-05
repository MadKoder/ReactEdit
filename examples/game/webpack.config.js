var path = require('path');
var webpack = require('webpack');

module.exports = {
  // devtool: 'eval',
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      /*'redux-devtools': path.join(__dirname, 'node_modules', 'redux-devtools'),*/
      'react': path.join(__dirname, 'node_modules', 'react')
    }
  },
  resolveLoader: {
    'fallback': path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [ {
        test: /\.json$/,
        loaders: ['json'],
        include: path.join(__dirname, 'node_modules', 'escodegen')
      }, {
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      }, {
        test: /\.css?$/,
        loaders: ['style', 'css'],
        exclude: /node_modules/,
        include: path.join(__dirname, 'src')
      }, {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"],
        include: path.join(__dirname, 'src')
      },
      // {
      //   test: /\.svg?$/,
      //   loader: 'svg-sprite!svgo',
      //   include: path.resolve('src/svg')
      // }
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  }
};
