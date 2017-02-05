/**
 * 描述 : 用于点击大图时候，跳出iframe弹出框到最外层，并且能够点击左右切换该组图片。配置在iframe内部时，必须最外层和iframe都引用
 * 参数 :
 *      e : jq event事件或者是调用子函数的名字
 *      e.data.area : 同一组图片的所在区域
 *      object : 调用子函数时候的附加参数
 * 作者 : liubibo
 */
function popBigPic (e,object) {
    var thisFun = arguments.callee;
    /**
     * 描述 : 点击关闭按钮时候关闭清空整个弹出层
     */
    thisFun.close = function (obj, iframeID) {
        var $tree = window.top;
        var $img = $(obj);
        if ($tree && $tree.length > 0) {                                                                                //如果是弹出框，需要单独处理
            var thisFrame = !!iframeID ? $(window.top).find('#' + iframeID) :  $(window.top);
            thisFrame.jQuery.event.remove(window.document.body, '.lockScreen');                                         //解除绑定，由于穿透到父级,$parentBody.off('.lockScreen')不能找到对应的jQuery._data( elem );
        } else {
            $('body').off('.lockScreen');
        }
        $img.closest('.pop-big-div').remove();
    };
    /**
     * 描述 : 点击向左按钮，从弹出层中取图片地址数据（json.stringify），以及当前图片的index
     */
    thisFun.left = function (obj) {
        var $popDiv = $(obj).closest('.pop-big-div');
        var imgObj= JSON.parse($popDiv.attr('img-arr'));
        var imgArr= imgObj.img;
        var ind = parseFloat($popDiv.attr('img-ind'));
        var whichOne, result;
        if (ind <= 0) {
            $popDiv.find('.left-image').css({
                cursor: "not-allowed"
            });
            alert('已经是第一张图片');
            return false;
        } else {
            if (ind + 1 <= imgArr.length) {
                $popDiv.find('.right-image').css({
                    cursor: "url(" + ROOT_URL+ "/view/images/rightArr.png),auto"
                })
            }
        }
        whichOne = ind > 0 ? (--ind) : 0;
        result = imgArr[whichOne].replace(reg, "$1");
        $popDiv.find('.pop-image').attr('src', result);
        $popDiv.find('.pop-small-image').attr('src', imgArr[whichOne]);                                                 //更新小的预览图
        $popDiv.attr('img-ind', whichOne);
    };
    thisFun.right = function (obj) {
        var $popDiv = $(obj).closest('.pop-big-div');
        var imgObj= JSON.parse($popDiv.attr('img-arr'));
        var imgArr= imgObj.img;
        var ind = parseFloat($popDiv.attr('img-ind'));
        var whichOne, result;
        if (ind + 1 >= imgArr.length) {                                                                                 //提示没有更多，同时悬浮图标改变
            $popDiv.find('.right-image').css({
                cursor: "not-allowed"
            });
            alert('已经是最后一张图片');
            return false;
        } else {
            $popDiv.find('.left-image').css({
                cursor: "url(" + ROOT_URL+ "/view/images/leftArr.png),auto"
            });
        }
        whichOne = ind < imgArr.length - 1 ? (++ind) : ind;
        result = imgArr[whichOne].replace(reg, "$1");
        $popDiv.find('.pop-image').attr('src', result);
        $popDiv.find('.pop-small-image').attr('src', imgArr[whichOne]);
        $popDiv.attr('img-ind', whichOne);
    };
    var reg = /(\.(jpg|png|gif|jpeg|bmp))[\s\S]*?\.\2/i;                                                                //过滤掉.jpg_140X140.jpg的后缀
    var parentWin = window.parent;
    var $parentBody = $(parentWin.document.body);
    if (typeof e === "string") {
        thisFun[e](object);
    } else {
        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
            var $this = $(this);
            var dataObj = e.data;
            var defaultOp = {
                area: ".jsPopBigArea"
            };
            var imgObj = {img: []};
            var ind = 0;
            var src = $this.attr('src');
            var nowOp = $.extend({}, defaultOp, dataObj);
            var iframeID = window.top === window.self ? "" : window.frameElement.id ? window.frameElement.id
                : window.frameElement.id = 'iframe_' + (Math.random() * 10000).toFixed(0) + (+new Date()) ;
            e.preventDefault();
            if (src) {
                var $popBig = $('<div class="bgDiv pop-big-div"></div>');
                var $bgSub = $('<div class="bg-sub-div"></div>');
                var $smallArea = $('<div class="positionA pop-small-area textC"></div>');
                var $bigArea = $('<div class="positionA pop-big-area textC"></div>');
                var $leftImage = $('<div class="positionA left-image" ' +
                    'onclick="popBigPic(\'left\',this, iframeID)"></div>');
                var $rightImage = $('<div class="positionA right-image" ' +
                    'onclick="popBigPic(\'right\',this, iframeID)"></div>');
                var $closeImage = $('<div class="positionA textC close-image" ' +
                    'onclick="popBigPic(\'close\',this, iframeID)">×</div>');
                var $focusInput = $('<input class="positionA textC focue-input" ' +
                    'type="text" style="visibility: visible; width:1px; height: 1px; opacity: 0.1">');                  //用于聚焦到当前的大图位置，解决esc关闭导致oDialog被关闭，滚动无法解锁问题。
                var result = src.replace(reg, "$1");
                var $popImg = $('<img class="pop-image" src="' + result + '"/>');
                var $popSmallImg = $('<img class="pop-small-image" style="cursor:progress;" src="' + src + '"/>');            //用于显示小的预览图
                $popBig.append($bgSub);
                $bgSub.append($smallArea);
                $smallArea.append($popSmallImg);
                $bgSub.append($bigArea);
                $bigArea.append($popImg);
                $bgSub.append($leftImage);
                $bgSub.append($rightImage);
                $bgSub.append($closeImage);
                $bgSub.append($focusInput);
                $this.closest(nowOp.area).find('.jsPopBigPic').each(function (i, t) {
                    if (this.src === src) {
                        ind = i;
                    }
                    imgObj.img.push(this.src);
                });
                $popBig.attr('img-arr', JSON.stringify(imgObj))
                    .attr('img-ind', ind)
                    .css({
                        top: $parentBody.scrollTop()
                    });
                $parentBody.append($popBig)
                    .on('scroll.lockScreen mousewheel.lockScreen', function (e) {                                       //阻止窗口上下移动。
                        e.preventDefault();
                        console.log(e.type);
                        return false;
                    }).on('keydown.lockScreen ', function (e) {
                    var keys = [37, 38, 39, 40];
                    var isKey = false;
                    $.each(keys, function (i, t) {
                        if (e.keyCode == t) {
                            isKey = true;
                            return false;
                        }
                    });
                    if (isKey) {
                        return false;
                    } else if (e.keyCode == 27) {
                        $parentBody.find('.pop-big-div').find('.close-image').trigger('click');
                        e.stopPropagation();
                        return false;
                    }
                });
                $focusInput.focus();
            }
        }
    }
}