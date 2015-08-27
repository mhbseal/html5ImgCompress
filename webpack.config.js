var
	paths = {
		src : './src/',
		dist: './dist/'
	},
	config = {
		entry: {
			html5ImgCompress: paths.src + 'html5ImgCompress'
		},
		output: {
			path: paths.dist,
			filename: '[name].min.js',
			chunkFilename: "[id].chunk.js"
		},
		resolve: {
			root: paths.src + 'libs/',
			alias: {
				JPEGEncoder: 'jpeg_encoder_basic',
				EXIF: 'exif',
				MegaPixImage: 'megapix-image'
			}
		}
	};

module.exports = config;