var index = 0;//轮播图用
var appid = "wx04d29c82e1d4eb0f";
var href = "http://www.youguangchina.cn/yxgj/";
// var href = "http://192.168.0.113:8080/";
// localStorage.setItem('userid',2);
//初始化
//urlSearch()用于将href给json化，方便获取之后的链接之后的code值；
function urlSearch() {
    var str=location.href; //取得整个地址栏
    var num=str.split('?');
    var arr;
    var data={};
    var name;
    $.each(num,function (ind,val) {
        if(ind>0){
            if(val.split('&').length>1){
                for(var i=0;i<val.split('&').length;i++){
                    arr=val.split('&')[i].split('=');
                    name=arr[0];
                    data[name]=arr[1];
                }
            }else {
                arr=val.split('=');
                var name=arr[0];
                data[name]=arr[1];
            }
        }
    });
    return data;
}


window.onload = function () {
    var getRequest = urlSearch();
    var key = localStorage.getItem('key');
    if(key === "Login"){
        var heighttt = $(window).height();
        console.log(heighttt);
        $(".limi").css('height',heighttt);
        // alert(window.location.href);
        //获取链接之后的code值，如果有code执行if。如果没有，执行else;
        if (getRequest.code!==undefined&&getRequest.code!==null&&getRequest.code!==localStorage.getItem('code')) {
            localStorage.setItem('code',getRequest.code);
            this.code = getRequest.code;
            //把code值传给后台；
            var logintype = "wxlogin";
            var wxcode = code;
            var d = {logintype:logintype,wxcode:wxcode};
            console.log(d);
            $.ajax({//微信授权
                url:href + 'login',
                type:'post',
                contentType:'application/json',
                data:JSON.stringify(d),
                dataType:'json',
                success:function (data) {
                    localStorage.setItem('userid',data.obj.id);
                    localStorage.setItem('openid',data.obj.wxopenid);
                    localStorage.setItem('login',1);
                    console.log(data);
                    if(getRequest.userid!==undefined&&getRequest.userid!==null){
                        // alert("欢迎进入某某某转发的界面");
                        var ddd = {url:'http://www.youguangchina.cn/yxgj/Mall/Login.html',wybs:getRequest.uuid};
                        console.log(ddd);
                        $.ajax({//转发点击量增加
                            url:href + 'zfrz/add?userId=' + getRequest.userid +  '&hdId=1',
                            type:'post',
                            contentType:'application/json',
                            data:JSON.stringify(ddd),
                            dataType:'json',
                            success:function (data) {
                                console.log(data);
                                // alert("转发点击量+1")
                            },
                            error:function () {
                                // alert("点击量增加出错");
                            }
                        });
                    }
                },
                error:function () {
                    console.log("code获取出错");
                }
            });

            var handle = function(event){
                event.preventDefault(); //阻止元素发生默认的行为
            };
            document.body.addEventListener('touchmove',handle,false);//添加监听事件--页面不可滚动
            // document.body.removeEventListener('touchmove',handle,false);//移除监听事件--页面恢复可滚动
        }
        //执行微信授权操作；
        else{
            // localStorage.setItem('login',1);
            var pageUrl = window.location.href
                .replace(/[/]/g, "%2f")
                .replace(/[:]/g, "%3a")
                .replace(/[#]/g, "%23")
                .replace(/[&]/g, "%26")
                .replace(/[=]/g, "%3d");
            //调用微信登陆授权获取code值
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid  + "" +
                "&redirect_uri=" + pageUrl + "&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect";
        }
    }
    else if(key === "Index"){
        var login = localStorage.getItem('login');
        if(login === 1||login === '1'){
            var width =  document.documentElement.clientWidth;
            var height = document.documentElement.clientHeight;
            $(".login").css({'width':width,'height':height});
            $.ajax({//获取banner图
                url:href + 'info/findByKeyContaining?key=phonebanner',
                type:'get',
                success:function (data) {
                    console.log(data);
                    for(var i = 0;i<data.obj.length;i++){
                        $(".one_img_one").append("<img src=\"" + href +"file/download?fileName=" +  data.obj[i].val + "\" class=\"one_imgone_img\" style=\"display: none;\">");
                        $(".one_img_point_item").append("<div class=\"point_item\" onclick='pointt($(\".point_item\").index(this))'></div>");
                    }
                    $(".one_imgone_img").eq(0).css('display','block');
                    $(".point_item").eq(0).css('background','red');
                    //轮播图设置
                    var start = setInterval(autoplay,3500);
                    var point = $(".point_item");
                    var funny = function (i) {
                        pointt(i);
                    };
                    for(var i = 0;i<point.length;i++){
                        funny(i);
                    }
                },
                error:function () {
                    console.log("数据获取出错");
                }
            });
            $.ajax({//获取分类
                url:href + 'hy/list',
                type:'get',
                success:function (data) {
                    console.log(data);
                    for(var i = 0 ;i<data.obj.length;i++){
                        if(i<4){
                            $(".one_three_item_i").before('<a class=\"one_three_item\" href="javascipt:void(0);" onclick="one_three_item(' +
                                '$(\'.one_three_item\').index(this));return false;">' + data.obj[i].hymc + '</a>')
                        }
                        else {
                            $(".expansion").append('<a class=\"expansion_item\" href="javascipt:void(0);" onclick="expansion_item(' +
                                '$(\'.expansion_item\').index(this));return false;">' + data.obj[i].hymc + '</a>')
                        }
                    }
                    $(".one_three_item").eq(0).addClass('item_add');
                    tool(data.obj[0].hymc);
                },
                error:function () {
                    alert("分类获取出错");
                }
            });
            activetwo(0);
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';
        }

    }
    else if(key === "Introduction"){
        //界面为某一个小工具界面
        var loginone = localStorage.getItem('login');
        if(loginone === 1||loginone === '1'){
            if (getRequest.id!==undefined&&getRequest.id!==null) {
                localStorage.setItem('toolid',getRequest.id);
                var id = getRequest.id;
                console.log(id);
                $.ajax({
                    url:href + 'cp/get?id=' + id,
                    type:'get',
                    success:function (data) {
                        console.log(data);
                        $(".intro_one").attr('src',href + "file/download?fileName=" + data.obj.cpxqt1);
                        $(".intro_two").attr('src',href +  "file/download?fileName=" + data.obj.cpxqt2);
                    },
                    error:function () {
                        console.log("获取小工具失败，请重新获取");
                    }
                });
            }
            else {//界面为没有小工具的界面
                alert("请重新进入小工具界面");
                window.location.href = 'Index.html'
            }
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';
        }
    }
    else if(key === "Win"){
        var logintwo = localStorage.getItem('login');
        if(logintwo != 1||logintwo != '1'){
            alert("请登录！");
            window.location.href = 'Login.html';
        }
    }
    else if(key === "Custom"){
        var loginthree = localStorage.getItem('login');
        if(loginthree != 1||loginthree != '1'){
            alert("请登录！");
            window.location.href = 'Login.html';
        }
        else {
            activetwo(4);
        }
    }
    else if(key === "Designer"){
        var loginfour = localStorage.getItem('login');
        if(loginfour != 1||loginfour != '1'){
            alert("请登录！");
            window.location.href = 'Login.html';
        }
        else {
            activetwo(5);
        }
    }
    else if(key === "Member"){
        var loginfive = localStorage.getItem('login');
        if(loginfive != 1||loginfive != '1'){
            alert("请登录！");
            window.location.href = 'Login.html';
        }
        else {
            activetwo(3);
        }
    }
    else if(key === "Partner"){
        var loginsix = localStorage.getItem('login');
        if(loginsix != 1||loginsix != '1'){
            alert("请登录！");
            window.location.href = 'Login.html';
        }
        else {
            activetwo(2);
        }
    }
    else if(key === "Share"){
        var logineight = localStorage.getItem('login');
        //生成uuid
        function uuidd() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uui = s.join("");
            return uui;
        }

        if(logineight === 1||logineight === '1'){
            var uuid = uuidd();
            console.log(uuid);
            var url = window.location.href;
            var data = {url:url};
            $.ajax({
                url:href + 'wx/getJsCfgByUrl?url=' + url,
                type:'get',
                success:function (data) {
                    console.log(data);
                    var timestamp = data.obj.timestamp;
                    var nonceStr = data.obj.nonceStr;
                    var signature = data.obj.signature;
                    var shareTitle = "测试";
                    var shareDesc = "测试内容";
                    var shareUrl = "http://www.youguangchina.cn/yxgj/Mall/Login.html?userid=" + localStorage.getItem('userid') + "&uuid=" + uuid;
                    wx.config({
                        debug: false,
                        appId: appid,
                        timestamp: timestamp,
                        nonceStr:  nonceStr,
                        signature: signature,
                        jsApiList: [
                            'onMenuShareAppMessage',
                            'onMenuShareTimeline',
                            'hideMenuItems'
                        ]
                    });
                    wx.ready(function () {
                        wx.hideMenuItems({
                            menuList: [
                                'menuItem:share:qq', // 分享道QQ
                                'menuItem:share:weiboApp',//分享给微博
                                'menuItem:share:QZone' // 分享到QQ空间
                            ],
                            success: function (res) {
                                // console.log("hide成功")
                            },
                            fail: function (res) {
                                // console.log("hide出错");
                            }
                        });
                        // 2. 分享接口
                        // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果
                        wx.onMenuShareAppMessage({
                            title: shareTitle, // 分享标题
                            desc: shareDesc, // 分享描述
                            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: '', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            trigger: function (res) {
                                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击发送给朋友');
                                console.log("点击发送");
                            },
                            success: function () {
                                // 用户确认分享后执行的回调函数
                                // alert('分享成功');
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                                // alert('已取消');
                            }
                        });
                        // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果
                        wx.onMenuShareTimeline({
                            title: shareTitle, // 分享标题
                            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: '', // 分享图标
                            trigger: function (res) {
                                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击分享到朋友圈');
                            },
                            success: function (res) {
                                // alert('分享成功');
                                //分享成功之后把填写的个人信息发给后台
                                var khxm = $("#name").val(),khsj = $("#phone").val(),khsp = $("#shopname").val(),khdz = $("#address").val();
                                var dat = {khxm:khxm,khsj:khsj,khsp:khsp,khdz:khdz};
                                console.log(dat);
                                if(khxm!=null&&khsj!=null&&khsp!=null&&khdz!=null&&khxm!=' '&&khsj!=' '&&khsp!=' '&&khdz!=' '&&khxm!=''&&khsj!=''&&khsp!=''&&khdz!=''){
                                    $.ajax({//填写信息的提交
                                        url:href + 'cpdd/add?userId=' + localStorage.getItem('userid') + '&hdId=1',
                                        type:'post',
                                        contentType:'application/json',
                                        data:JSON.stringify(dat),
                                        dataType:'json',
                                        success:function (data) {
                                            console.log(data);
                                            if(data.success === true||data.success === "true"){
                                                $("#phone").val(null);
                                                $("#name").val(null);
                                                $("#shopname").val(null);
                                                $("#address").val(null);
                                                // alert("提交成功");
                                                $.ajax({//转发成功，给后台判定是否是第一次转发
                                                    url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                                                    type:'post',
                                                    success:function (data) {
                                                        console.log(data);
                                                        if(data.success === false){
                                                            $(".share_limit").toggle();
                                                        }
                                                    },
                                                    error:function () {
                                                        console.log("数据获取出错");
                                                    }
                                                });
                                            }
                                        },
                                        error:function () {
                                            console.log("请重新刷新界面！");
                                        }
                                    });
                                }
                                else {
                                    alert("个人信息不能为空或者空格！请重新输出");
                                    $("#phone").val(null);
                                    $("#name").val(null);
                                    $("#shopname").val(null);
                                    $("#address").val(null);
                                }
                            },
                            cancel: function (res) {
                                // alert('已取消');
                            }
                        });
                        // alert('已注册获取“分享到朋友圈”状态事乿');
                        wx.error(function (res) {
                            // console.log("config信息验证失败");
                            console.log(res);
                            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可
                            // 以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                        });
                    });
                },
                error:function () {
                    console.log("error");
                }
            });
            activetwo(1);
        }
        else {
            alert("请登录！");
            window.location.href = 'Logn.html';
        }
    }
};

//登陆界面
$(".login_four").click(function () {
    window.location.href = 'Index.html'
});

//首页
//分类切换ok
var n = 0;//n用于确认更多分类界面是否处于下拉状态，1表示是，0表示不是
function one_three_item(i) {
    $(".one_three_item").removeClass('item_add').eq(i).addClass('item_add');
    if(n === 1){
        $(".one_three_item_i").toggleClass('item_i_add').children('#item_img').toggleClass('item_img');
        $(".expansion").toggle("");
        n = 0;
    }
    tool($(".one_three_item").eq(i).text());
}
//点击小工具进入小工具详情页ok
function one_four_item(i) {
    var id = $(".one_four_item").eq(i).attr('data-id');
    window.location.href = 'Introduction.html?id=' + id + '';
    $.ajax({//增加小工具的访问量
        url:href + 'sjrz/update?cpId=' + id + '&sjxw=ll',
        type:'get',
        success:function (data) {
            console.log(data);
        },
        error:function () {
            console.log("小工具出错");
        }
    });

}
//点击大宝箱进入点击赢好礼界面ok
$(".one_two_href").click(function () {
    window.location.href = 'Win.html';
});
//点击我的优惠券进入优惠券ok
$(".one_button").click(function () {
    $(".mycard").toggle("");
    $(".mycard_content").children().remove();
    $.ajax({
        url:href + 'yhq/list?userId=' + localStorage.getItem('userid'),
        type:'get',
        success:function (data) {
            console.log(data);
            if(data.obj.length === 0){
                $(".mycard_content").append("<p class=\"one_four_p\">暂无优惠券- _ - |||</p>")
            }
            else {
                $(".mycard_content").append("<div class=\"gift_card\">\n" +
                    "                    <div class=\"gift_one\">\n" +
                    "                        <div class=\"gift_num\">" + data.obj[0].je + "</div>\n" +
                    "                        <div class=\"gift_infotmation\">无门槛</div>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"gift_two\">\n" +
                    "                        <div class=\"gift_id\">12546457897</div>\n" +
                    "                        <div class=\"gift_time\">有效期至 " + data.obj[0].jsrq + " </div>\n" +
                    "                    </div>\n" +
                    "                </div>")
            }

        },
        error:function () {
            console.log("优惠券获取错误，请重新刷新界面！");
        }
    });
});
//优惠券列表退出ok
$(".mycard_canel").click(function () {
    $(".mycard").toggle("");
});
//点击更多，出现更多的分类ok
$(".one_three_item_i").click(function () {
    if(n === 0){//下拉
        n = 1;
        $(".one_three_item").removeClass('item_add');
        $(this).toggleClass('item_i_add').children('#item_img').toggleClass('item_img');
        $(".expansion").toggle("");
        $(".expansion_item").removeClass('expansion_item_add');
    }
    else {//上拉
        n = 0;
        $(".one_three_item").removeClass('item_add');
        $(this).toggleClass('item_i_add').children('#item_img').toggleClass('item_img');
        $(".expansion").toggle("");
    }
});

//更多分类选中ok
function expansion_item(i) {
    $(".expansion_item").removeClass('expansion_item_add').eq(i).addClass('expansion_item_add');
    tool($(".expansion_item").eq(i).text());
}
//轮播图设置ok
function autoplay() {
    if(index === $(".point_item").length){
        index = 0;
    }
    changeImg(index++);
}
function changeImg(index) {
    var list = $(".one_imgone_img");
    var list1 = $(".point_item");
    list.eq(index).css('display','block');
    list1.eq(index).css('background','red');
    for(var i = 0;i<list.length;i++){
        if(i!=index){
            list.eq(i).css('display','none');
            list1.eq(i).css('background','rgba(0,0,0,0.5)');
        }
    }
}
function pointt(i) {
    changeImg(i);
    index = i;
}
//分类小工具数据获取ok
function tool(i) {
    console.log(i);
    $(".one_fourbox").children().remove();
    $.ajax({//获取第一个分类小工具
        url:href + 'cp/list?hymc=' + i,
        type:'get',
        success:function (data) {
            console.log(data);
            if(data.obj.length === 0){
                $(".one_fourbox").append("<p class=\"one_four_p\">暂无数据- _ - |||</p>")
            }
            else {
                for(var i = 0;i<data.obj.length;i++){
                    $(".one_fourbox").append("<div class=\"one_four_item\" data-id='" + data.obj[i].id + "'" +
                        "onclick='one_four_item($(\".one_four_item\").index(this))'>\n" +
                        "                <div class=\"one_four_item_imgbox\">\n" +
                        "                    <img src=\"" +  href +"file/download?fileName="
                        + data.obj[i].cpzst + "\" class=\"one_four_item_img\">\n" +
                        "                </div>\n" +
                        "                <div class=\"one_four_item_intro\">" + data.obj[i].cpmc + "</div>\n" +
                        "            </div>")
                }
            }
        },
        error:function () {
            console.log("小工具数据获取出错");
        }
    });
}



//小工具详情页
//点击购买，出现预约报名界面
$(".content_three").click(function () {
    $(".buy").toggle("");
});
//点击预约界面提交，出现提交成功提示ok
$(".buy_submit").click(function () {
    var khxm = $("#name").val(),khsj = $("#phone").val(),khsp = $("#shopname").val(),khdz = $("#address").val();
    var data = {khxm:khxm,khsj:khsj,khsp:khsp,khdz:khdz};
    console.log(data);
    if(khxm!=null&&khsj!=null&&khsp!=null&&khdz!=null&&khxm!=' '&&khsj!=' '&&khsp!=' '&&khdz!=' '&&khxm!=''&&khsj!=''&&khsp!=''&&khdz!=''){
        $.ajax({//购买接口
            url:href + 'cpdd/add?userId=' + localStorage.getItem('userid') + '&cpId='
            + localStorage.getItem('toolid'),
            type:'post',
            contentType:'application/json',
            data:JSON.stringify(data),
            dataType:'json',
            success:function (data) {
                console.log(data);
                if(data.success === true||data.success === "true"){
                    $(".buy_ok").toggle();
                    $(".buy").hide();
                    $("#phone").val(null);
                    $("#name").val(null);
                    $("#shopname").val(null);
                    $("#address").val(null);
                }
            },
            error:function () {
                console.log("请重新刷新界面！");
            }
        });
    }
    else {
        alert("个人信息不能为空！请重新输出");
        $("#phone").val(null);
        $("#name").val(null);
        $("#shopname").val(null);
        $("#address").val(null);
    }
});
//点击提交成功提示界面按钮，出现小工具详情页
$(".buy_ok_submit").click(function () {
    $(".buy_ok").toggle("");
});

//点击赢好礼界面
$("#share").click(function () {
    window.location.href = "Share.html";
});
$("#partner").click(function () {
    window.location.href = "Partner.html";
});
$("#member").click(function () {
    window.location.href = "Member.html";
});
$("#designer").click(function () {
    window.location.href = "Designer.html";
});
$("#custom").click(function () {
    window.location.href = "Custom.html";
});

//分享界面
$(".limit_submit").click(function () {
    $(".share_limit").hide();
});

//合伙人界面
$(".partner_submit").click(function () {
    active(2);
});
//会员界面
$(".member_submit").click(function () {
    active(3);
});
//定制开发界面
$(".custom_submit").click(function () {
    active(4);
});
//设计师界面
$(".designer_button").click(function () {
    active(5);
});

//封装个人信息提交功能
function active(n) {
    var khxm = $("#name").val(),khsj = $("#phone").val(),khsp = $("#shopname").val(),khdz = $("#address").val();
    var data = {khxm:khxm,khsj:khsj,khsp:khsp,khdz:khdz};
    console.log(data);
    if(khxm!=null&&khsj!=null&&khsp!=null&&khdz!=null&&khxm!=' '&&khsj!=' '&&khsp!=' '&&khdz!=' '&&khxm!=''&&khsj!=''&&khsp!=''&&khdz!=''){
        $.ajax({//提交
            url:href + 'cpdd/add?userId=' + localStorage.getItem('userid') + '&hdId=' + n,
            type:'post',
            contentType:'application/json',
            data:JSON.stringify(data),
            dataType:'json',
            success:function (data) {
                console.log(data);
                if(data.success === true||data.success === "true"){
                    $("#phone").val(null);
                    $("#name").val(null);
                    $("#shopname").val(null);
                    $("#address").val(null);
                    alert("提交成功")
                }
            },
            error:function () {
                console.log("请重新刷新界面！");
            }
        });
    }
    else {
        alert("个人信息不能为空或者空格！请重新输出");
        $("#phone").val(null);
        $("#name").val(null);
        $("#shopname").val(null);
        $("#address").val(null);
    }
}
function activetwo(n) {
    $.ajax({//增加活动的访问量
        url:href + 'sjrz/update?hdId=' + n + '&sjxw=ll',
        type:'get',
        success:function (data) {
            console.log(data);
        },
        error:function () {
            console.log("活动点击出错");
        }
    });
}