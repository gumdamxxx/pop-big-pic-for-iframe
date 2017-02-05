用于点击大图时候，跳出iframe弹出框到最外层，并且能够点击左右切换该组图片。
=============================
### 注意
  配置在iframe内部时，必须最外层和iframe都引用
  此插件基于jQuery。
### 调用
  方法1：
    $('#image-wrapper').on('click','.jsPopBigPic',{ area:"#all-image-div"}, popBigPic)
    $(代理对象).on('click',需要弹出的大图,{ area:当前一组图的公共区域}, popBigPic)
  方法2:
    $('.jsPopBigPic').on('click','',{ area:"#all-image-div"}, popBigPic)
    $(需要弹出的大图).on('click','此处必须为空且存在',{ area:当前一组图的公共区域}, popBigPic)
    
