module.exports = {
  entry: {
    html5ImgCompress: './src/html5ImgCompress'
  },
  output: {
    path: './dist/',
    filename: '[name].min.js',
    chunkFilename: "[id].chunk.min.js",
    library: 'html5ImgCompress',
    libraryTarget: 'umd'
  }
};