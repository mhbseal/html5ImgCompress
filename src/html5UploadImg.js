var
  ua = navigator.userAgent,
  isInWechat = ~ua.indexOf('MicroMessenger'),
  isAndroid = ~ua.indexOf('Android'),
  isOldIos = (function () {
    var match = navigator.userAgent.match(/(\d)_\d like Mac OS/);
    return match && match[1] <= 7;
  })(),
  URL = window.URL || window.webkitURL,
  scripts = document.scripts,
  src = scripts[scripts.length - 1].src;

// 打包 async require path
__webpack_public_path__ = src.substr(0, src.lastIndexOf('/') + 1);

/**
 * 组件构造器
 * @param {file} 上传文件
 * @param {object}
 *   maxWidth: {number} 最大宽度(如果最大高宽同时存在则根据原图的高宽比例来计算以哪个为准)
 *   maxHeight: {number} 最大高度
 *   quality: {number} 质量等级(类似PS保存事的质量等级，并不是压缩比例)，取值范围 0-1
 *   done: {function} 成功handler
 *   notSupport: {function} 浏览器不支持handler
 */
function html5UploadImg(file, options) {
  var DEFAULTE = html5UploadImg.DEFAULTE;

  this.file = file;
  this.options = {};

  for (var key in DEFAULTE) {
    this.options[key] = options[key] == null ? DEFAULTE[key] : options[key];
  }

  this.init();
}

html5UploadImg.prototype = {
  init: function () {
    if (URL && File && document.createElement('canvas').getContext) {
      this.read(this.file);
    } else { // 浏览器不支持
      this.options.notSupport();
    }
  },
  /**
   * 读取文件，用canvas画出来并用toDataURL来压缩后转成base64
   * @param {file} 上传文件
   */
  read: function (file) {
    var
      self = this,
      img = new Image(),
      fileURL = URL.createObjectURL(file),
      size, canvas, ctx, iosImg, quality, encoder, base64, handler, iosRenderOptions;

    img.src = fileURL;

    img.onload = function () {
      handler = function (orientation) {
        quality = self.options.quality
        size = self.getSize(img, orientation);
        canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        ctx = canvas.getContext('2d');

        if (isOldIos) { // iOS6/iOS7
          require(['MegaPixImage'], function (MegaPixImage) {
            iosImg = new MegaPixImage(img);
            iosRenderOptions = {
              maxWidth: canvas.width,
              maxHeight: canvas.height,
              orientation: orientation
            }
            if (~"68".indexOf(orientation)) { // 90，270度则高宽互换
              iosRenderOptions.maxWidth = canvas.height;
              iosRenderOptions.maxHeight = canvas.width;
            }
            iosImg.render(canvas, iosRenderOptions);
            base64 = canvas.toDataURL('image/jpeg', quality);

            self.done(canvas, img, fileURL, base64, file);
          })
        } else { // 其他设备
          switch (orientation) { // 根据方向在画布不同的位置画图
            case 3:
              ctx.rotate(180 * Math.PI / 180);
              ctx.drawImage(img, -canvas.width, -canvas.height, canvas.width, canvas.height);
              break;
            case 6:
              ctx.rotate(90 * Math.PI / 180);
              ctx.drawImage(img, 0, -canvas.width, canvas.height, canvas.width);
              break;
            case 8:
              ctx.rotate(270 * Math.PI / 180);
              ctx.drawImage(img, -canvas.height, 0, canvas.height, canvas.width);
              break;
            default:
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }

          if (isAndroid && isInWechat) { // 安卓微信下压缩有问题
            require(['JPEGEncoder'], function (JPEGEncoder) {
              encoder = new JPEGEncoder();
              base64 = encoder.encode(ctx.getImageData(0, 0, canvas.width, canvas.height), quality * 100);
              self.done(canvas, img, fileURL, base64, file);
            })
          } else {
            base64 = canvas.toDataURL('image/jpeg', quality);
          }

          self.done(canvas, img, fileURL, base64, file);
        }
      };

      if (!isAndroid) { // 非安卓需要获取orientation来drawImage，所以要以引入exif
        require(['EXIF'], function (EXIF) {
          EXIF.getData(img, function () {
            handler(EXIF.getTag(this, "Orientation"));
          })
        })
      } else {
        handler();
      }
    }

  },
  // 成功handler
  done: function(canvas, img, fileURL, base64, file) {
    // 释放内存
    canvas = null;
    img = null;
    URL.revokeObjectURL(fileURL);

    this.options.done(base64, file);
  },
  /**
   * 图片最大高宽校正（方向和比例）
   * @param  {image} 图片
   * @param  {number} 图片方向 1)正常 3)180度 6)90度 8)270度
   * @return  {object}
   *   width: {number} 矫正后的width
   *   height: {number} 校正后的hieght
   */
  getSize: function (img, orientation) {
    var
      options = this.options,
      mW = options.maxWidth,
      mH = options.maxHeight,
      w = img.width,
      h = img.height,
      scale;

    if (~"68".indexOf(orientation)) { // 90，270度则高宽互换
      w = img.height;
      h = img.width;
    }

    scale = w / h;

    if (mW && mH) {
      if (scale >= mW / mH) {
        if (w > mW) {
          h = mW / scale;
          w = mW;
        }
      } else {
        if (h > mH) {
          w = mH * scale;
          h = mH;
        }
      }
    } else if (mW) {
      if (mW < w) {
        h = mW / scale;
        w = mW;
      }
    } else if (mH) {
      if (mH < h) {
        w = mH * scale;
        h = mH;
      }
    }

    return { width: w, height: h };
  }
};

// 默认参数
html5UploadImg.DEFAULTE = {
  maxWidth: 1024,
  maxHeight: 768,
  quality: 0.6,
  done: function() { console.log('done') },
  notSupport: function() { console.log('brower not support html5 upload img') }
}


module.exports = window.html5UploadImg = html5UploadImg;