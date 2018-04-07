"use strict";

//cookie判断
~function () {
  var uid = window.C.getCookie("uid");
  if (uid !== undefined) {
    var callback = function (data) {
      if (data != undefined) {
        var str = "";
        var nowH = new Date().getHours();
        if (nowH >= 5 && nowH < 9) {
          str = "早上好，<a href='#'>" + data + "</a>";
        } else if (nowH >= 9 && nowH < 12) {
          str = "上午好，<a href='#'>" + data + "</a>";
        } else if (nowH >= 12 && nowH < 19) {
          str = "下午好，<a href='#'>" + data + "</a>";
        } else if (nowH >= 19 || nowH < 5) {
          str = "晚上好，<a href='#'>" + data + "</a>";
        }
        C("#welcome-uname").html(str);
        C(".topbar-login").hide().next().show();
      } else {
        C(".topbar-login").show().next().hide();
      }
    };
    C.ajax({
      type: 'post',
      url: './data/islogin.php',
      data: {
        "uid": uid
      },
      fn: callback
    });
  } else {
    C(".topbar-login").show().next().hide();
  }
}();
// 退出
~function () {
  C("#logout").click(function () {
    C.delCookie({
      "name": "uid",
      "path": "/"
    });
    location.href = "./pass/login.html"
  });
}();
// 轮播图
~function () {
  C.ajax({
    url:"./data/index_slider.php",
    type:"get",
    data:"",
    dataType:"json",
    fn:callback
  });
  function callback(data) {
    var slider=new Slider(data);
  }

}();
//

