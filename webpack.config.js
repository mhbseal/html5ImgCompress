var
	path = require('path'),
	paths = {
		src : './src/',
		dist: './dist/'
	},
	config = {
		entry: {
			html5UploadImg: paths.src + 'html5UploadImg.js'
		},
		output: {
			path: paths.dist,
			filename: '[name].bundle.js',
			chunkFilename: "[name].chunk.js"
		},
		resolve: {
			root: paths.src,
			alias: {
				JPEGEncoder: 'libs/jpeg_encoder_basic.js',
				EXIF: 'libs/exif.js',
				MegaPixImage: 'libs/megapix-image.js'
			}
		}
	};

module.exports = config;