var webpack = require("webpack");
var path = require("path");
var pkg = require('../package.json');

module.exports = {
  target:  "web",
  cache:   false,
  context: __dirname,
  debug:   false,
  devtool: false,
  entry:   ["../src/client"],
  output:  {
    path:          path.join(__dirname, "../static/dist"),
    filename:      "client.js",
    chunkFilename: "[name].[id].js"
  },
  plugins: [
    new webpack.DefinePlugin({__CLIENT__: true, __SERVER__: false, __PRODUCTION__: true, __DEV__: false, __PKG__:`"${pkg.name}"`}),
    new webpack.DefinePlugin({"process.env": {NODE_ENV: '"production"'}}),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
  ],
  module:  {
    loaders: [
      { test: /\.json$/, loaders: ["json"]},
      { test: /\.(ico|gif|png|jpg|jpeg|svg|webp)$/, loaders: ["file?context=static&name=/[path][name].[ext]"], exclude: /node_modules/},
      { test: /\.jade?$/,        exclude: /node_modules/,       loader: 'jade'},
      { test: /\.woff(\?\S*)?$/,                               loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?\S*)?$/,                               loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,           loader: 'file-loader' },
      { test: /\.less$/,                                        loader: "style!css!less"},
      // { test: /\.scss$/,                                        loaders: ['style', 'css', 'sass'] },
      { test: /\.css$/,                                         loaders: ['style','css']},
      { test: require.resolve('jquery'),                        loader: 'expose?$!expose?jQuery' },
      { test: /bootstrap\/js\//,                                loader: 'imports?jQuery=jquery' },
    ],
    postLoaders: [
      {test: /\.js$/, loaders: ["babel?presets[]=es2015&presets[]=stage-0&presets[]=react"], exclude: /node_modules/}
    ],
    noParse: /\.min\.js/
  },
  resolve: {
    modulesDirectories: [ "src", "node_modules", "static" ],
    extensions: ["", ".json", ".js"]
  },
  node:    {
    __dirname: true,
    fs:        'empty'
  }
};
