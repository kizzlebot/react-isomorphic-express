


var webpack       = require("webpack");
var nodeExternals = require("webpack-node-externals");
var path          = require("path");
var fs            = require("fs");
var dotenv = require('dotenv');
var pkg = require('../package.json');


dotenv.config({path:path.resolve('./.env')});

var env = {
  "process.env": {
    NODE_ENV: '"production"',
    FACEBOOK_ID:`"${process.env.FACEBOOK_ID}"`,
    FACEBOOK_SECRET:`"${process.env.FACEBOOK_SECRET}"`,
    GOOGLE_ID:`"${process.env.GOOGLE_ID}"`,
    GOOGLE_SECRET:`"${process.env.GOOGLE_SECRET}"`,
    GITHUB_ID:`"${process.env.GITHUB_ID}"`,
    GITHUB_SECRET:`"${process.env.GITHUB_SECRET}"`,
    INSTAGRAM_ID:`"${process.env.INSTAGRAM_ID}"`,
    INSTAGRAM_SECRET:`"${process.env.INSTAGRAM_SECRET}"`
  }
};

module.exports = {
  target:  "node",
  cache:   false,
  context: __dirname,
  debug:   false,
  devtool: "source-map",
  entry:   ["../src/server"],
  output:  {
    path:          path.join(__dirname, "../dist"),
    filename:      "server.js"
  },
  plugins: [
    new webpack.DefinePlugin({__CLIENT__: false, __SERVER__: true, __PRODUCTION__: true, __DEV__: false, __PKG__:`"${pkg.name}"`}),
    new webpack.DefinePlugin(env)
  ],
  module:  {
    loaders: [
      { test: /\.json$/, loaders: ["json"]},
      { test: /\.(ico|gif|png|jpg|jpeg|svg|webp)$/, loaders: ["file?context=static&name=/[path][name].[ext]"], exclude: /node_modules/},
      { test: /\.js$/, loaders: ["babel?presets[]=es2015&presets[]=stage-0&presets[]=react"], exclude: /node_modules/},
      { test: /\.jade?$/,        exclude: /node_modules/,       loader: 'jade'},
      { test: /\.woff(\?\S*)?$/,                               loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?\S*)?$/,                               loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,           loader: 'file-loader' },
      { test: /\.less$/,                                        loader: "style!css!less"},
      { test: /\.scss$/,                                        loaders: ['style', 'css', 'sass'] },
      { test: /\.css$/,                                         loaders: ['style','css']}
    ],
    postLoaders: [
    ],
    noParse: /\.min\.js/
  },
  externals: [nodeExternals({
    whitelist: ["webpack/hot/poll?1000"]
  })],
  resolve: {
    modulesDirectories: [
      "src",
      "node_modules",
      "static"
    ],
    extensions: ["", ".json", ".js"]
  },
  node:    {
    __dirname: true,
    fs:        "empty"
  }
};
