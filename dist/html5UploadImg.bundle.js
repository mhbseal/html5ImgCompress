/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);

/******/ 	};

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		0:0
/******/ 	};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}

/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);

/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;

/******/ 			script.src = __webpack_require__.p + "" + ({}[chunkId]||chunkId) + ".chunk.js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};

/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var
	  ua = navigator.userAgent,
	  isInWechat = ~ua.indexOf('MicroMessenger'),
	  isAndroid = ~ua.indexOf('Android'),
	  isOldIos = (function () {
	    var match = navigator.userAgent.match(/(\d)_\d like Mac OS/);
	    return match && match[1] > 7;
	  })(),
	  URL = window.URL || window.webkitURL;
	  __webpack_require__.p = (function () {
	    var src = document.scripts[document.scripts.length - 1].src;
	    console.log(src);
	    return src.substr(0, src.lastIndexOf('/')) + '/';
	  })();

	/**
	 * 构造器
	 * @param {file}
	 * @param {options}
	 */
	function html5UploadImg(file, options) {
	  this.file = file;
	  this.options = {
	    maxWidth: options.width || 1000,
	    maxHeight: options.height || 1000,
	    quality: options.quality || 0.8,
	    done: options.done
	  };

	  this.init();
	}

	html5UploadImg.prototype = {
	  init: function () {
	    if (URL && File && document.createElement('canvas').getContext) {
	      this.read(this.file);
	    } else { // 不支持操作
	      this.options.notSupport();
	    }
	  },
	  read: function (file) {
	    var
	      self = this,
	      img = new Image(),
	      fileURL = URL.createObjectURL(file),
	      size, canvas, ctx, iosImg, quality, encoder, base64, handler;

	    img.src = fileURL;

	    img.onload = function () {
	      handler = function (orientation) {
	        quality = self.options.quality
	        size = self.getSize(img, orientation);
	        canvas = document.createElement('canvas');
	        canvas.width = size.w;
	        canvas.height = size.h;
	        ctx = canvas.getContext('2d');

	        if (isOldIos) { // iOS6/iOS7
	          __webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(1)]; (function (MegaPixImage) {
	            iosImg = new MegaPixImage(img);
	            iosImg.render(canvas, {
	              maxWidth: canvas.width,
	              maxHeight: canvas.height,
	              orientation: orientation
	            });
	            base64 = canvas.toDataURL('image/jpeg', quality);

	            self.done(canvas, img, fileURL, base64, file);
	          }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));})
	        } else { // 其他设备
	          switch (orientation) {
	            case 3:
	              ctx.rotate(180 * Math.PI / 180);
	              ctx.drawImage(img, -size.w, -size.h, size.w, size.h);
	              break;
	            case 6:
	              ctx.rotate(90 * Math.PI / 180);
	              ctx.drawImage(img, 0, -size.w, size.h, size.w);
	              break;
	            case 8:
	              ctx.rotate(270 * Math.PI / 180);
	              ctx.drawImage(img, -size.h, 0, size.h, size.w);
	              break;
	            default:
	              ctx.drawImage(img, 0, 0, size.w, size.h);
	          }

	          if (isAndroid && isInWechat) { // 安卓微信下压缩有问题
	            __webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(2)]; (function (JPEGEncoder) {
	              encoder = new JPEGEncoder();
	              base64 = encoder.encode(ctx.getImageData(0, 0, size.w, size.h), quality * 100);
	              self.done(canvas, img, fileURL, base64, file);
	            }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));})
	          } else {
	            base64 = canvas.toDataURL('image/jpeg', quality);
	          }

	          self.done(canvas, img, fileURL, base64, file);
	        }
	      };

	      if (!isAndroid) { // 非安卓需要获取orientation来drawImage，所以要以引入exif
	        __webpack_require__.e/* require */(3, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(3)]; (function (EXIF) {
	          EXIF.getData(img, function () {
	            handler(EXIF.getTag(this, "Orientation"));
	          })
	        }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));})
	      } else {
	        handler(1);
	      }
	    }

	  },
	  done: function(canvas, img, fileURL, base64, file) {
	    // 释放内存
	    canvas = null;
	    img = null;
	    URL.revokeObjectURL(fileURL);
	    this.options.done(base64, file);
	  },
	  /**
	   * 图片max高宽校正（方向和比例）
	   * @param img
	   * @returns
	   */
	  getSize: function (img, orientation) {
	    var
	      mWidth = this.options.maxWidth,
	      mHeight = this.options.maxHeight,
	      w = img.width,
	      h = img.height,
	      scale;

	    if (~"68".indexOf(orientation)) {
	      w = img.height;
	      h = img.width;
	    }

	    scale = w / h;

	    if (mWidth && mHeight) {
	      if (scale >= mWidth / mHeight) {
	        if (w > mWidth) {
	          mHeight = mWidth / scale;
	        }
	      } else {
	        if (h > mHeight) {
	          mWidth = mHeight * scale;
	        }
	      }
	    } else if (mWidth) {
	      if (mWidth < w) {
	        mHeight = mWidth / scale;
	      }
	    } else if (mHeight) {
	      if (mHeight < h) {
	        mWidth = mHeight * scale;
	      }
	    }

	    return {
	      w: mWidth,
	      h: mHeight
	    }
	  }
	};

	module.exports = window.html5UploadImg = html5UploadImg;

/***/ }
/******/ ]);