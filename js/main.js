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

window.onload = function () {
    // document.addEventListener('touchmove', handler, false);//阻止默认事件
    var getRequest = urlSearch();
    var key = localStorage.getItem('key');
    if(key === "Login"){
        var heighttt = $(window).height();
        //ios，判断链接是否带有ui，来判断苹果苹果手机第二次刷新界面时是否需要微信授权
        if(getRequest.ui===1||getRequest.ui==='1'){//无需授权，直接刷新数据
            sss(0);
            if(getRequest.userid!==undefined&&getRequest.userid!==null){
                alert("ios欢迎进入某某某转发的界面");
                var ddd = {url:'http://www.youguangchina.cn/yxgj/Mall/Login.html',wybs:getRequest.uuid};
                console.log(ddd);
                $.ajax({//转发点击量增加
                    url:href + 'zfrz/add?userId=' + getRequest.userid +  '&hdId=1$cpddId=' + getRequest.ddid,
                    type:'post',
                    contentType:'application/json',
                    data:JSON.stringify(ddd),
                    dataType:'json',
                    success:function (data) {
                        alert("ios转发成功");
                        console.log(data);
                    },
                    error:function () {
                    }
                });
            }
            var handle = function(event){
                event.preventDefault(); //阻止元素发生默认的行为
            };
            document.body.addEventListener('touchmove',handle,false);//添加监听事件--页面不可滚动
            // document.body.removeEventListener('touchmove',handle,false);//移除监听事件--页面恢复可滚动
        }
        else {//安卓手机，或者苹果手机初始化
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
                        var userid = getRequest.userid;
                        var uuid = getRequest.uuid;
                        var ddid =  getRequest.ddid;
                        var dod = {userid:userid,uuid:uuid,ddid:ddid};
                        window.history.pushState(null, null, 'http://www.youguangchina.cn/yxgj/Mall/Login.html');
                        sss(0);
                        // alert(JSON.stringify(dod));
                        if(userid!==undefined&&userid!==null){
                            // alert("欢迎进入某某某转发的界面");
                            var ddd = {url:'http://www.youguangchina.cn/yxgj/Mall/Login.html',wybs:uuid};
                            $.ajax({//转发点击量增加
                                url:href + 'zfrz/add?userId=' + userid +  '&hdId=1&cpddId=' + ddid,
                                type:'post',
                                contentType:'application/json',
                                data:JSON.stringify(ddd),
                                dataType:'json',
                                success:function (data) {
                                    console.log(data);
                                    // alert("转发点击量+1");
                                    $.ajax({//转发行为增加
                                        url: href + 'sjrz/update?hdId=1&sjxw=zf',
                                        type:'get',
                                        success:function (data) {
                                            console.log(data);
                                            // alert("转发点击量+1")
                                        },
                                        error:function () {
                                            // alert("点击量增加出错");
                                        }
                                    });
                                },
                                error:function (data) {
                                    alert(JSON.stringify(data));
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
    }
    else if(key === "Index"){
        var login = localStorage.getItem('login');
        if(login === 1||login === '1'){
            sss();
            var width =  document.documentElement.clientWidth;
            var height = document.documentElement.clientHeight;
            $(".login").css({'width':width,'height':height});
            // $(".index_body").css('height',height);
            $.ajax({//获取banner图
                url:href + 'info/findByKeyContaining?key=phonebanner',
                type:'get',
                success:function (data) {
                    console.log(data);
                    var lj;
                    for(var i = 0;i<data.obj.length;i++){
                        if(parseInt(data.obj[i].key.replace(/[^0-9]/ig,"")) === 0){
                            lj = href + "Mall/Share.html?jk=1";
                        }
                        else if(parseInt(data.obj[i].key.replace(/[^0-9]/ig,"")) ===1){
                            lj = href + "Mall/Partner.html?jk=1";
                        }
                        else if(parseInt(data.obj[i].key.replace(/[^0-9]/ig,"")) === 2){
                            lj = href + "Mall/Member.html";
                        }
                        else if(parseInt(data.obj[i].key.replace(/[^0-9]/ig,"")) === 3){
                            lj = href + "Mall/Custom.html";
                        }
                        else if(parseInt(data.obj[i].key.replace(/[^0-9]/ig,"")) === 4){
                            lj = href + "Mall/Designer.html";
                        }
                        $(".one_img_one").append("<a  href=\"" + lj + "\" class=\"one_img_herf\">" +
                            "<img data-id=\"" + lj + "\"  src=\"" + href +"file/download?fileName=" + data.obj[i].val + "\" class=\"one_imgone_img\"></a>");
                        if(i === 0){
                            $(".one_img_one").append("<a  href=\"" + lj + "\" class=\"one_img_herf\">" +
                                "<img data-id=\"" + lj + "\" src=\"" + href +"file/download?fileName=" + data.obj[data.obj.length-1].val + "\" class=\"one_imgone_img\"></a>");
                        }
                    }
                    var one_img_href = $(".one_img_herf");
                    var one_img_one = $(".one_img_one");
                    var ww = $(window).width();
                    var number = one_img_href.length;
                    one_img_one.css('width',ww*number);
                    one_img_href.css('width',ww);

                    //触摸开始的时候触发
                    one_img_href.on("touchstart", function(e) {
                        startX = e.originalEvent.changedTouches[0].pageX;
                        startY = e.originalEvent.changedTouches[0].pageY;
                    });
                    //手指在结束的时候
                    one_img_href.on("touchend", function(e) {
                        e.preventDefault();
                        moveEndX = e.originalEvent.changedTouches[0].pageX;
                        moveEndY = e.originalEvent.changedTouches[0].pageY;
                        X = moveEndX - startX;
                        Y = moveEndY - startY;
                        var left = one_img_href.offset().left;
                        var j  = one_img_href.index(this);
                        if ( X > 5 ) {
                            // console.log("向左滑动");
                            index = j-1;
                            if(j === 0){//代表目前是第一个。不能进行左滑操作
                            }
                            else {
                                one_img_one.animate({
                                    left:ww+left
                                });
                            }
                        }
                        else if(X<-5){
                            // console.log("向右滑动");
                            index = j+1;
                            if(j === number-1){
                                // console.log("最后一个不能右滑");
                                one_img_one.css('left',0);
                            }
                            else {
                                one_img_one.animate({
                                    left:-ww*(j+1)
                                });
                            }
                        }
                        else {
                            // console.log("dianji");
                            var kkdd = $(".one_imgone_img").eq(j).attr('data-id');
                            window.location.href = kkdd;
                        }
                    });
                    //触发在屏幕上滑动的时候移动
                    one_img_href.on("touchmove", function(e) {
                        e.preventDefault();
                    });
                    var start = setInterval(autoplay,3000);
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
                    var kk = 0;
                    for(var i = 0 ;i<data.obj.length;i++){
                        if(data.obj[i].status === 1){
                            kk++;
                            $(".one_threebox").append('<a class=\"one_three_item\" href="javascipt:void(0);" onclick="one_three_item(' +
                                '$(\'.one_three_item\').index(this));return false;">' + data.obj[i].hymc + '</a>')
                        }
                    }
                    $(".one_three_item").eq(0).addClass('item_add');
                    tool(data.obj[0].hymc,'sjsj');
                },
                error:function () {
                    alert("分类获取出错");
                }
            });
            activetwo(6);
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
                sss();
                $.ajax({
                    url:href + 'cp/get?id=' + id,
                    type:'get',
                    success:function (data) {
                        console.log(data);
                        $(".intro_one").attr('src',href + "file/download?fileName=" + data.obj.cpxqt1);
                        $(".intro_three").attr('src',href + "file/download?fileName=" + data.obj.cpxqt2);
                        $(".intro_two").attr('src',href +  "file/download?fileName=" + data.obj.cpxqt3);
                        if(id === '45'){
                            console.log(111);
                            $(".buy_item_tc").hide();
                        }
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
        if(logintwo === 1||logintwo === '1'){
            sss();
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';
        }
    }
    else if(key === "Custom"){
        var loginthree = localStorage.getItem('login');
        if(loginthree === 1||loginthree === '1'){
            activetwo(4);
            sss();
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';
        }
    }
    else if(key === "Designer"){
        var loginfour = localStorage.getItem('login');
        // loginfour = 1;
        if(loginfour === 1||loginfour === '1'){
            activetwo(5);
            sss();
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';
        }
    }
    else if(key === "Member"){
        var loginfive = localStorage.getItem('login');
        if(loginfive === 1||loginfive === '1'){
            activetwo(3);
            sss();
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';
        }
    }
    else if(key === "Partner"){
        if(getRequest.jk===1||getRequest.jk==='1'){//py=1代表该代理界面是从商城进入的，不需要微信授权
            var loginsix = localStorage.getItem('login');
            // loginsix = 1;
            if(loginsix === 1||loginsix === '1'){
                activetwo(2);
                sss();
            }
            else {
                alert("请登录！");
                window.location.href = 'Login.html';
            }
        }
        else {//该界面不是从商城进入的，而是从海报进入的，需要微信授权
            if(getRequest.ui===1||getRequest.ui==='1'){//ios设备二次刷新之后的界面，不微信授权
                ssss();//因为需要微信授权，所以微信分享使用转发界面的微信分享代码
                activetwo(2);
            }
            else {//安卓设备和苹果设备第一次进入之后的界面
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
                            window.history.pushState(null, null, 'http://www.youguangchina.cn/yxgj/Mall/Partner.html');
                            ssss();
                            activetwo(2);
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
        }
    }
    else if(key === "Share"){
        if(getRequest.jk=== 1||getRequest.jk==='1'){//jk表示该分享界面是从商城进入的，不微信授权
            var logineight = localStorage.getItem('login');
            if(logineight === 1||logineight === '1'){
                ssss();
                activetwo(1);
            }
            else {
                alert("请登录！");
                window.location.href = 'Login.html';
            }
        }
        else {//不是通过商城进入的分享界面，需要进行微信授权
            //ios，判断链接是否带有ui，来判断苹果苹果手机第二次刷新界面时是否需要微信授权
            if(getRequest.ui===1||getRequest.ui==='1'){//ios设备二次刷新之后的界面，不微信授权
                ssss();
                activetwo(1);
            }
            else {//安卓设备，ios设备初始化
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
                            window.history.pushState(null, null, 'http://www.youguangchina.cn/yxgj/Mall/Share.html');
                            ssss();
                            activetwo(1);
                            // qrcode();
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


        }
    }
    else if(key === "Package"){
        var loginnine = localStorage.getItem('login');
        if(loginnine === 1||loginnine === '1'){
            sss();
            if (getRequest.id!==undefined&&getRequest.id!==null) {
                localStorage.setItem('toolid',getRequest.id);
                $.ajax({
                    url:href + 'cp/get?id=' +  getRequest.id,
                    type:'get',
                    success:function (data) {
                        console.log(data);
                        $(".package_img").attr('src',href +  "file/download?fileName=" + data.obj.cptct);
                    },
                    error:function () {
                        console.log("获取套餐失败，请重新获取");
                    }
                });
            }
            else {//界面为没有小工具的界面
                alert("请重新进入套餐界面");
                window.location.href = 'Index.html'
            }
        }
        else {
            alert('请登录！');
            window.location.href = 'Login.html';
        }
    }
    else if(key === 'about'){
        var loginten = localStorage.getItem('login');
        if(loginten === 1||loginten === '1'){
            ssss();
        }
        else {
            alert("请登录！");
            window.location.href = 'Login.html';

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
    tool($(".one_three_item").eq(i).text(),'sjsj');
    var special = $(".special_item_two_font");
    special.removeClass('special_item_add');
    special.eq(0).addClass('special_item_add');
}
//点击小工具进入小工具详情页ok
function one_four_item(i) {
    var id = $(".one_four_item").eq(i).attr('data-id');
    // console.log(id);
    $.ajax({//增加小工具的访问量
        url:href + 'sjrz/update?cpId=' + id + '&sjxw=ll',
        type:'get',
        success:function (data) {
            console.log(data);
            window.location.href = 'Introduction.html?id=' + id + '';
        },
        error:function () {
            console.log("小工具出错");
        }
    });
}
//点击大宝箱进入点击赢好礼界面ok
$(".one_two_img").click(function () {
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
                $(".mycard_content").append("<p class=\"one_four_p\">暂无代金券</p>" +
                    "<a class=\"one_four_href\" href=\"Share.html\">前往获取代金券</a>")
            }
            else {
                if(data.obj[0].yxzt === 1){
                    $(".mycard_content").append("<p class=\"one_four_p\">代金券已使用</p>")
                        // "<a class=\"one_four_href\" href=\"Share.html\">前往获取抵扣券</a>")
                }
                else {
                    $(".mycard_content").append("<div class=\"gift_card\">\n" +
                        "                    <div class=\"gift_one\">\n" +
                        "                        <div class=\"gift_num\">" + data.obj[0].je + "</div>\n" +
                        "                        <div class=\"gift_infotmation\">代金券</div>\n" +
                        "                    </div>\n" +
                        "                    <div class=\"gift_two\">\n" +
                        "                        <div class=\"gift_id\">" + data.obj[0].yhm + "</div>\n" +
                        "                        <div class=\"gift_time\">序列号</div>\n" +
                        "                    </div>\n" +
                        "                </div>")
                }
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
//关于我们点击跳转
$(".one_button_two").click(function () {
    window.location.href = 'about.html';
});
//更多分类选中ok
function expansion_item(i) {
    $(".expansion_item").removeClass('expansion_item_add').eq(i).addClass('expansion_item_add');
    tool($(".expansion_item").eq(i).text(),'sjsj');
    var special = $(".special_item_two_font");
    special.removeClass('special_item_add');
    special.eq(0).addClass('special_item_add');
}
//轮播图设置ok

function autoplay() {
    var one_img_href = $(".one_img_herf");
    var one_img_one = $(".one_img_one");
    // console.log("index:" + index);
    var ww = one_img_href.width();
    var number = one_img_href.length;
    // console.log("图片个数："+ number);
    if(index >= number-1){
        index = 0;
        one_img_one.css('left',0);
    }
    else {
        one_img_one.animate({
            left:-ww*(index+1)
        });
        index++;
    }
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
function tool(i,k) {
    // console.log(i,k);
    var one_fourbox = $(".one_fourbox");
    one_fourbox.children().remove();
    if(i === '全部'){
        $.ajax({//获取第一个分类小工具sjsj新款上市，gms购买数，rd热度
            url:href + 'cp/list?sort=' + k + '&order=desc',
            type:'get',
            success:function (data) {
                var m = 0;
                var kk = 0;
                console.log(data);
                if(data.obj.length === 0){
                    one_fourbox.append("<img class=\"one_four_nodata\" src=\"image/Details/nodata.png\">\n" +
                        "            <p class=\"one_four_p\">暂无数据</p>")
                }
                else {
                    for(var i = 0;i<data.obj.length;i++){
                        if(data.obj[i].cpzt === 1){
                            m++;
                            one_fourbox.append("<div class=\"one_four_item\" data-id='" + data.obj[i].id + "'" +
                                "onclick='one_four_item($(\".one_four_item\").index(this))'>\n" +
                                "                <div class=\"one_four_item_imgbox\">\n" +
                                "                    <img src=\"" +  href +"file/download?fileName="
                                + data.obj[i].cpzst + "\" class=\"one_four_item_img\">\n" +
                                " <div class=\"one_four_item_left\">\n" +
                                "                        购买数量：" + data.obj[i].gms + "\n" +
                                "                    </div>"+
                                "                     <div class=\"one_four_item_hot\">\n" +
                                "                       <div class=\"one_four_item_hot_item\">热度</div>"+
                                "                    </div>"+
                                "                </div>\n" +
                                "                <div class=\"one_four_item_intro\">" + data.obj[i].cpmc + "</div>\n" +
                                "                <div class=\"one_four_item_shop\">\n" +
                                "                    <div>购买数量：" + data.obj[i].gms + "</div>\n" +
                                "                </div>\n"+
                                "            </div>");
                            if(data.obj[i].rd!==null||data.obj[i].rd!==undefined||data.obj[i].rd!==''){
                                var hot = $(".one_four_item_hot");
                                var mk = parseInt(data.obj[i].rd);//整数
                                var mkm = parseFloat(data.obj[i].rd)%1;//取余
                                for(var j = 0;j<mk;j++){
                                    hot.eq(kk).append("<img class='hot_ime' src=\"image/Details/xing.png\">");
                                }
                                if(mkm > 0){
                                    hot.eq(kk).append("<img class='hot_ime' src=\"image/Details/xing_two.png\">");
                                }
                            }
                            kk++;
                        }
                    }
                    if(m === 0){
                        one_fourbox.append("<img class=\"one_four_nodata\" src=\"image/Details/nodata.png\">\n" +
                            "            <p class=\"one_four_p\">暂无数据</p>")
                    }
                }
            },
            error:function () {
                console.log("小工具数据获取出错");
            }
        });
    }
    else {
        $.ajax({//分类小工具
            url:href + 'cp/list?hymc=' + i + '&sort=' + k + '&order=desc',
            type:'get',
            success:function (data) {
                console.log(data);
                var m = 0;
                var kk = 0;
                if(data.obj.length === 0){
                    one_fourbox.append("<img class=\"one_four_nodata\" src=\"image/Details/nodata.png\">\n" +
                        "            <p class=\"one_four_p\">暂无数据</p>")
                }
                else {
                    for(var i = 0;i<data.obj.length;i++){
                        if(data.obj[i].cpzt === 1){
                            m++;
                            one_fourbox.append("<div class=\"one_four_item\" data-id='" + data.obj[i].id + "'" +
                                "onclick='one_four_item($(\".one_four_item\").index(this))'>\n" +
                                "                <div class=\"one_four_item_imgbox\">\n" +
                                "                    <img src=\"" +  href +"file/download?fileName="
                                + data.obj[i].cpzst + "\" class=\"one_four_item_img\">\n" +
                                " <div class=\"one_four_item_left\">\n" +
                                "                        购买数量：" + data.obj[i].gms + "\n" +
                                "                    </div>"+
                                "                     <div class=\"one_four_item_hot\">\n" +
                                "                       <div class=\"one_four_item_hot_item\">热度</div>"+
                                "                    </div>"+
                                "                </div>\n" +
                                "                <div class=\"one_four_item_intro\">" + data.obj[i].cpmc + "</div>\n" +
                                "                <div class=\"one_four_item_shop\">\n" +
                                "                    <div>购买数量：" + data.obj[i].gms + "</div>\n" +
                                "                </div>\n"+
                                "            </div>");
                            var hot = $(".one_four_item_hot");
                            var mk = parseInt(data.obj[i].rd);//整数
                            var mkm = parseFloat(data.obj[i].rd)%1;//取余
                            for(var j = 0;j<mk;j++){
                                hot.eq(kk).append("<img class='hot_ime' src=\"image/Details/xing.png\">");
                            }
                            if(mkm > 0){
                                hot.eq(kk).append("<img class='hot_ime' src=\"image/Details/xing_two.png\">");
                            }
                            kk++;
                        }
                    }
                    if(m === 0){
                        one_fourbox.append("<img class=\"one_four_nodata\" src=\"image/Details/nodata.png\">\n" +
                            "            <p class=\"one_four_p\">暂无数据</p>")
                    }
                }
            },
            error:function () {
                console.log("小工具数据获取出错");
            }
        });
    }
}
//排序点击
$(".special_item_two").click(function () {
    var index = $(".special_item_two").index(this),lx;
    var t = $(".item_add").text();
    var special = $(".special_item_two_font");
    special.removeClass('special_item_add');
    special.eq(index).addClass('special_item_add');
    if(t === null||t === ""||t === undefined){
        t = $(".expansion_item_add").text();
    }
    if(index === 0){
        lx = "sjsj";
    }
    else if(index === 1){
        lx = "gms";
    }
    else if(index === 2){
        lx = "rd";
    }
    tool(t,lx);
});

$(".one_footer_header").click(function () {
    window.location.href = "Designer.html";
});

//小工具详情页
//点击购买，出现预约报名界面
$(".content_three").click(function () {
    $(".buy").toggle("");
    var name = $("#name"),phone = $("#phone"),shopname = $("#shopname"),address = $("#address");
    phone.val(null);
    name.val(null);
    shopname.val(null);
    address.val(null);
});
$(".buy").click(function (e) {
    if($(e.target).closest('.buy_box').length<1){
        $(".buy").hide("");
    }
});
//点击预约界面提交，出现提交成功提示ok
$(".buy_submit").click(function () {
    event.stopPropagation();
    var name = $("#name"),phone = $("#phone"),shopname = $("#shopname"),address = $("#address");
    var khxm = name.val(),khsj = phone.val(),khsp = shopname.val(),khdz = address.val(),tclx = null;
    for(var i = 0;i<$(".item_radio").length;i++){
        if($(".item_radio").eq(i).is(":checked")){
            tclx = $(".item_radio").eq(i).val();
        }
    }
    var data = {khxm:khxm,khsj:khsj,khsp:khsp,khdz:khdz,tclx:tclx};
    console.log(data);
    if(khxm!==null&&khsj!==null&&khxm!==' '&&khsj!==' '&&khxm!=='' &&khsj!==''){
        var number = khsj.replace(/[^0-9]+/g, '').length;
        if(number!==11&&number!==7){
            alert("请输入正确的手机号码！");
        }
        else {
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
                        setTimeout(no,2000);
                        $(".buy").hide();
                        phone.val(null);
                        name.val(null);
                        shopname.val(null);
                        address.val(null);
                    }
                },
                error:function () {
                    console.log("请重新刷新界面！");
                }
            });
        }
    }
    else {
        alert("个人信息不能为空！请重新输出");
    }
});

//点击提交成功提示界面按钮，出现小工具详情页
$(".buy_ok_submit").click(function () {
    $(".buy_ok").hide("");
    // event.stopPropagation();
});

//点击套餐选择，跳转到套餐界面
$(".header").click(function () {
    var getRequest = urlSearch();
    window.location.href = "Package.html?id=" + getRequest.id;
});
$(".buy_item_a").click(function () {
    var getRequest = urlSearch();
    window.location.href = "Package.html?id=" + getRequest.id;
});
//购买界面的退出
$(".buy_shutdown").click(function () {
    $(".buy").hide("");
});

//点击赢好礼界面
$("#share").click(function () {
    window.location.href = "Share.html?jk=1";
});
$("#partner").click(function () {
    window.location.href = "Partner.html?jk=1";
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
//分享界面的信息提交
$(".share_submit").click(function () {
    //分享成功之后把填写的个人信息发给后台
    var phone = $("#phone");
    var khsj = phone.val();
    var dat = {khsj:khsj};
    console.log(dat);
    if(khsj!==null&&khsj!==' '&&khsj!==''){
        var number = khsj.replace(/[^0-9]+/g, '').length;
        if(number!==11&&number!==7){
            alert("请输入正确的手机号码！");
        }
        else {
            $.ajax({//填写信息的提交
                url:href + 'cpdd/add?userId=' + localStorage.getItem('userid') + '&hdId=1',
                type:'post',
                contentType:'application/json',
                data:JSON.stringify(dat),
                dataType:'json',
                success:function (data) {
                    console.log(data);
                    var ddid = data.obj.id;
                    if(data.success === true||data.success === "true"){
                        phone.val(null);
                        io = 1;
                        $(".buy_ok").show();
                        setTimeout(no,2000);
                        var uuid = uuidd();
                        console.log(uuid);
                        var url = window.location.href;
                        $.ajax({//微信分享
                            url:href + 'wx/getJsCfgByUrl?url=' + url,
                            type:'get',
                            success:function (data) {
                                console.log(data);
                                var timestamp = data.obj.timestamp;
                                var nonceStr = data.obj.nonceStr;
                                var signature = data.obj.signature;
                                var shareTitle = "有光 聚客宝";
                                var shareDesc =  "一键推广，轻松获客，迅速提高营业额！\n2019分享经济，营销新模式";
                                var shareUrl = "http://www.youguangchina.cn/yxgj/Mall/Login.html?userid=" + localStorage.getItem('userid') +
                                    "&uuid=" + uuid + "&ddid=" + ddid;
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
                                        imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                                        type: '', // 分享类型,music、video或link，不填默认为link
                                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                                        trigger: function (res) {
                                            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击发送给朋友');
                                            console.log("点击发送");
                                        },
                                        success: function () {
                                            // 用户确认分享后执行的回调函数
                                            // alert('只有分享到朋友圈才有优惠券哦！');
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
                                        imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                                        trigger: function (res) {
                                            // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击分享到朋友圈');
                                        },
                                        success: function (res) {
                                            // alert('分享成功');
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
                    }
                },
                error:function () {
                    console.log("请重新刷新界面！");
                }
            });
        }
    }
    else {
        alert("联系方式不能为空或者空格！请重新输出");
        phone.val(null);
    }
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
    var name = $("#name"),phone = $("#phone"),shopname = $("#shopname"),address = $("#address"),opinion = $("#opinion");
    var khxm = name.val(),khsj = phone.val(),khsp = shopname.val(),khdz = address.val();
    var data = {khxm:khxm,khsj:khsj,khsp:khsp,khdz:khdz};
    if(khsj!==null&&khsj!==' '&&khsj!==''&&khxm!==null&&khxm!==''&&khxm!==' '){
        var number = khsj.replace(/[^0-9]+/g, '').length;
        if(number!==7&&number!==11){
            alert("请输入正确的手机号码！");
        }
        else {
            if(n === 5){//设计师界面
                var op = opinion.val();
                // console.log(op,op.length);
                if(op.length >200){
                    alert("字数请保持在200字以内！");
                }
                var dd = {khxm:khxm,khsj:khsj,sjsjy:op};
                console.log(dd);
                $.ajax({//提交
                    url:href + 'cpdd/add?userId=' + localStorage.getItem('userid') + '&hdId=' + n,
                    type:'post',
                    contentType:'application/json',
                    data:JSON.stringify(dd),
                    dataType:'json',
                    success:function (data) {
                        console.log(data);
                        if(data.success === true||data.success === "true"){
                            phone.val(null);
                            name.val(null);
                            opinion.val(null);
                            // alert("提交成功，我们的工作人员会尽快与您取得联系。");
                            $(".buy_ok").show();
                            var timer = setInterval(no,2000);
                        }
                    },
                    error:function () {
                        console.log("请重新刷新界面！");
                    }
                });
            }
            else {
                $.ajax({//提交
                    url:href + 'cpdd/add?userId=' + localStorage.getItem('userid') + '&hdId=' + n,
                    type:'post',
                    contentType:'application/json',
                    data:JSON.stringify(data),
                    dataType:'json',
                    success:function (data) {
                        console.log(data);
                        if(data.success === true||data.success === "true"){
                            phone.val(null);
                            name.val(null);
                            shopname.val(null);
                            address.val(null);
                            // alert("提交成功，我们的工作人员会尽快与您取得联系。");
                            $(".buy_ok").show();
                            setTimeout(no,2000);
                        }
                    },
                    error:function () {
                        console.log("请重新刷新界面！");
                    }
                });
            }
        }

    }
    else {
        alert("个人信息不能为空或者空格！请重新输出");
        phone.val(null);
        name.val(null);
        shopname.val(null);
        address.val(null);
    }
}

//暂定1.5s消失，提交信息成功
function no() {
    $(".buy_ok").hide("");
}
//活动点击量
function activetwo(n) {
    if(n === 6){
        $.ajax({//增加商城的访问量
            url:href + 'sjrz/update?sjxw=scll',
            type:'get',
            success:function (data) {
                console.log(data);
            },
            error:function () {
                console.log("活动点击出错");
            }
        });
    }
    else {
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

}
//分享
function sss(yy) {
    var url = window.location.href;
    var newurl = window.location.href + '?ui=1';
    if(yy === 0){
        //判断是否是ios设备
        var isIOS = function() {
            var isIphone = navigator.userAgent.includes('iPhone');
            var isIpad = navigator.userAgent.includes('iPad');
            return isIphone || isIpad;
        };
        if(isIOS()){
            var getRequest = urlSearch();
            if(getRequest.ui!==undefined&&getRequest.ui!==null){//存在ui
            }
            else {//不存在ui刷新界面
                window.location.href=newurl;
            }
        }
    }
    $.ajax({
        url:href + 'wx/getJsCfgByUrl?url=' + url,
        type:'get',
        success:function (data) {
            console.log(data);
            var timestamp = data.obj.timestamp;
            var nonceStr = data.obj.nonceStr;
            var signature = data.obj.signature;
            var shareTitle = "有光 聚客宝";
            var shareDesc =  "一键推广，轻松获客，迅速提高营业额！\n2019分享经济，营销新模式";
            var shareUrl = "http://www.youguangchina.cn/yxgj/Mall/Login.html";
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
                    imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击发送给朋友');
                    },
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        $.ajax({//转发成功，给后台判定是否是第一次转发
                            url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                            type:'post',
                            success:function (data) {
                                console.log(data);
                                // if(data.success === false){
                                //     // $(".share_limit").toggle();
                                // }
                            },
                            error:function () {
                                console.log("数据获取出错");
                            }
                        });
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
                    imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        // alert('分享成功');
                        $.ajax({//转发成功，给后台判定是否是第一次转发
                            url:href + 'yhq/add?userId=' + localStorage.getItem('userid') + '&yhhdId=1',
                            type:'post',
                            success:function (data) {
                                console.log(data);
                                // if(data.success === false){
                                //     // $(".share_limit").toggle();
                                // }
                            },
                            error:function () {
                                console.log("数据获取出错");
                            }
                        });
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
}
//分享界面初始化分享功能（未提交信息之前的分享）
function ssss() {
    var url = window.location.href;
    var newurl = window.location.href + '?ui=1';
    var getRequest = urlSearch();
    if(getRequest.jk===1||getRequest.jk==='1'){//表示该页面是从商城进入的

    }
    else{//该页面是从二维码进入的
        //判断是否是ios设备
        var isIOS = function() {
            var isIphone = navigator.userAgent.includes('iPhone');
            var isIpad = navigator.userAgent.includes('iPad');
            return isIphone || isIpad;
        };
        if(isIOS()){
            if(getRequest.ui!==undefined&&getRequest.ui!==null){//存在ui
            }
            else {//不存在ui刷新界面
                window.location.href=newurl;
            }
        }
    }
    $.ajax({
        url:href + 'wx/getJsCfgByUrl?url=' + url,
        type:'get',
        success:function (data) {
            console.log(data);
            var timestamp = data.obj.timestamp;
            var nonceStr = data.obj.nonceStr;
            var signature = data.obj.signature;
            var shareTitle = "有光 聚客宝";
            var shareDesc =  "一键推广，轻松获客，迅速提高营业额！\n2019分享经济，营销新模式";
            var shareUrl = "http://www.youguangchina.cn/yxgj/Mall/Login.html?";
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
                    imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击发送给朋友');
                    },
                    success: function () {
                        // 用户确认分享后执行的回调函数
                        alert("请先提交信息再分享！")
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
                    imgUrl: 'http://www.youguangchina.cn/yxgj/Mall/image/YG.png', // 分享图标
                    trigger: function (res) {
                        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返噿
//                        alert('用户点击分享到朋友圈');
                    },
                    success: function (res) {
                        // alert('分享成功');
                        alert("请先提交信息再分享！")
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
}

//分享界面获取二维码(已弃置)
function qrcode() {
    var url = 'http://www.youguangchina.cn/yxgj/Mall/Login.html';
    $(".qrcode").attr('src',href + 'wx/shareQrcodeByContent?content=' + url+'&fileName=af7a5142-df27-4854-a5b7-83a2651cd352.png')
}

//封面页面跳转工具详情
$(".label").click(function () {
    window.location.href = 'about.html';
});
$(".partner_about").click(function () {
    window.location.href = 'about.html';
});