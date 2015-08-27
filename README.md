### demo
http://mhbseal.com/demo/html5/html5ImgCompress/demo/index.html
### usage
1.引入/dist目录(这里采用的是异步加载兼容js，chunk123为处理hack的js，不能删除)  
2.html中插入

    <script src="/dist/html5ImgCompress.min.js"></script>
3.代码如下

    <input type="file" />
    <script>
      document.getElementsByTagName('input')[0].addEventListener("change", function(e) {
        new html5ImgCompress(e.target.files[0], {
          before: function(file) {
            console.log('压缩前...');
            // 这里一般是对file进行filter，例如用file.type.indexOf('image') > -1来检验是否是图片
            // 如果为非图片，则return false放弃压缩（不执行后续done、fail、complate），并相应提示
          },
          done: function (base64, file) {
            console.log('压缩成功...');
            // ajax和服务器通信上传base64图片等操作
          },
          fail: function(file) {
            console.log('压缩失败...');
          },
          complate: function(file) {
            console.log('压缩完成...');
          },
          notSupport: function(file) {
            console.log('浏览器不支持！')
            // 不支持操作，例如PC在这里可以采用swfupload上传
          }
        });
      }, false)
    </script>
4.参数说明

    new html5ImgCompress(file, options);
    
    @param {file} 上传文件
    @param {object} options选项
      maxWidth: {number} 最大宽度(如果最大高宽同时存在则根据原图的高宽比例来计算以哪个为准)，默认值1000
      maxHeight: {number} 最大高度，默认值1000
      quality: {number} 质量等级(类似PS保存事的质量等级，并不是压缩比例)，取值范围 0-1，默认值0.6
      before: {function} 压缩前handler
        @param {file} 原始上传文件
        @return {boolean} 是否放弃，返回false放弃压缩
      done: {function} 成功handler
        @param {string} 生成的base64图片
        @param {file} 原始上传文件
      fail: {function} 失败handler
        @param {file} 原始上传文件
      complate: {function} 完成handler
        @param {file} 原始上传文件
      notSupport: {function} 浏览器不支持handler
        @param {file} 原始上传文件
### hack
1.图片方向处理  
2.安卓微信压缩问题hack  
3.IOS6/7压缩扭曲  
4.多张上传（如果浏览器支持）
