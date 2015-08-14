var
  ua = navigator.userAgent,
  isInWechat = ~ua.indexOf('MicroMessenger'),
  isAndroid = ~ua.indexOf('Android'),
  isOldIos = (function () {
    var match = navigator.userAgent.match(/(\d)_\d like Mac OS/);
    return match && match[1] > 7;
  })(),
  URL = window.URL || window.webkitURL;
  __webpack_public_path__ = (function () {
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
          require(['MegaPixImage'], function (MegaPixImage) {
            iosImg = new MegaPixImage(img);
            iosImg.render(canvas, {
              maxWidth: canvas.width,
              maxHeight: canvas.height,
              orientation: orientation
            });
            base64 = canvas.toDataURL('image/jpeg', quality);

            self.done(canvas, img, fileURL, base64, file);
          })
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
            require(['JPEGEncoder'], function (JPEGEncoder) {
              encoder = new JPEGEncoder();
              base64 = encoder.encode(ctx.getImageData(0, 0, size.w, size.h), quality * 100);
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