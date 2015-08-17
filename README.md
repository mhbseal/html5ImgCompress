### demo
http://mhbseal.com/demo/html5/html5UploadImg/demo/index.html
### usage
1.引入/dist目录(这里采用的是异步加载兼容js，chunk123为处理hack的js，不能删除)  
2.html中插入

    <script src="/dist/html5UploadImg.min.js"></script>  
3.代码如下

    <input type="file" />
    <script>
      document.getElementsByTagName('input')[0].addEventListener("change", function(e) {
        new html5UploadImg(e.target.files[0], {
          done: function (base64, file) {
            console.log('done')
            // ajax和服务器通信等操作...
          },
          notSupport: function() {
            console.log('brower not support html5 upload img')
            // 不支持操作，例如PC在这里可以采用swfupload上传...
          }
        });
      }, false)
    </script>
4.参数说明

    new html5UploadImg(file, options);
    
    @param {file} 上传文件
    @param {object} options选项
      maxWidth: {number} 最大宽度(如果最大高宽同时存在则根据原图的高宽比例来计算以哪个为准)，默认值1000
      maxHeight: {number} 最大高度，默认值1000
      quality: {number} 质量等级(类似PS保存事的质量等级，并不是压缩比例)，取值范围 0-1，默认值0.6
      done: {function} 成功handler
        @param {string} 生成的base64图片
        @param {file} 原始上传文件
      notSupport: {function} 浏览器不支持handler
### hack
1.图片方向处理  
2.安卓微信压缩问题hack  
3.IOS6/7压缩扭曲  
4.多张上传（安卓目前最高版本4.5，4.5-不支持，具体代码见demo）
