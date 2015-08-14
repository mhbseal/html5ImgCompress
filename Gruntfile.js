module.exports = function (grunt) {

	var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
	  requirejs: {
		  options: {
			  baseUrl: './src/',
			  paths: {
				  JPEGEncoder: 'libs/jpeg_encoder_basic',
				  EXIF: 'libs/exif',
				  MegaPixImage: 'libs/megapix-image',
				  html5UploadImg: 'html5UploadImg'
			  },
			  outUrl: './dest/'
		  },
		  html5UploadImg: {
			  options: {
				  include: [
					  'JPEGEncoder',
					  'EXIF',
					  'MegaPixImage',
						'html5UploadImg'
				  ],
				  out: '<%= requirejs.options.outUrl  %>html5UploadImg-' + pkg.version + '.js'
			  }
		  }
	  }
  });

	// 载入插件
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	// 注册任务
	grunt.registerTask('html5UploadImg', ['requirejs']);
	
};