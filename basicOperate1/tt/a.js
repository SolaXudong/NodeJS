Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function getLocalTime(nS) {
    if (nS && nS.indexOf("T") != -1) {
        nS = nS.replace("T", " ").substring(0, 19);
    } else if (nS && nS.indexOf(" ") != -1) {
        nS = nS.substring(0, 19);
    }
    return nS;
}

function getLocalDateStr(nS) {
    if (nS && nS.indexOf("T") != -1) {
        nS = nS.replace("T", " ").substring(0, 10);
    } else if (nS && nS.indexOf(" ") != -1) {
        nS = nS.substring(0, 10);
    }
    return nS;
}

function getLocalDate(nS) {
    if (nS && nS.indexOf("T") != -1) {
        nS = nS.replace("T", " ").substring(0, 10);
    } else if (nS && nS.indexOf(" ") != -1) {
        nS = nS.substring(0, 10);
    }
    return nS;
}
/**
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var result = new Date(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
*/
function getNowDate(isHaveTime) {
    if (isHaveTime)
        return new Date().format("yyyy-MM-dd hh:mm:ss");
    else
        return new Date().format("yyyy-MM-dd");
}

function getNowDateByTimes(cur) {
    var date = new Date(cur);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var result = new Date(year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second);
    return result.Format("yyyy-MM-dd");
}

function transSecond2HourAndMinutes(nS) {
    var total = parseInt(nS);
    var hour = parseInt(total / 3600).toFixed(0);
    var minute = parseInt((total - hour * 3600) / 60).toFixed(0);
    var second = parseInt(total - hour * 3600 - minute * 60).toFixed(0);
    var _tmp = hour + "小时" + minute + "分钟";
    var _tmp2 = hour + "小时" + minute + "分钟" + second + "秒";
    return _tmp;
}
// 图片点击查看
function layerShow(o) {
    // 打开窗口
    layer.open({
        type: 1,
        title: "鼠标滚轮可放大",
        skin: 'layui-layer-rim', // 加上边框
        area: ['62%', '90%'], // 宽高
        shadeClose: true, // 开启遮罩关闭
        maxmin: true,
        content: '<img id="_stretch" src="' + $(o).attr("src") + '" width="100%" height="100%" />'
    });
    bindStretch();
}
// 绑定鼠标滚轮事件（参考：https://zhidao.baidu.com/question/552685864.html）
function bindStretch() {
    var scrollFunc = function (e) {
        //console.log(e.detail, e.wheelDelta);
        var _pm = 10;
        if (e.wheelDelta < 0) {
            _pm = -10;
        }
        _w = parseInt(parseInt($('#_stretch').attr('width')) + _pm);
        _h = parseInt(parseInt($('#_stretch').attr('height')) + _pm);
        if (_w >= 100 && _w < 200) {
            $('#_stretch').attr('width', _w + '%');
            $('#_stretch').attr('height', _h + '%');
            $('#_stretch').parent().animate({ scrollTop: $('#_stretch').parent().height() / 3 });
            $('#_stretch').parent().animate({ scrollLeft: $('#_stretch').parent().width() / 3 });
        }
        //$('#_stretch').parent().parent().attr("style", $('#_stretch').parent().parent().attr("style").replace(/width: \d*%/, 'width: '+parseInt(_w+_pm)+'%'));
        //$('#_stretch').parent().parent().attr("style", $('#_stretch').parent().parent().attr("style").replace(/height: \d*%/, 'height: '+parseInt(_h+_pm)+'%'));
    }
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }
    window.onmousewheel = document.onmousewheel = scrollFunc;
}