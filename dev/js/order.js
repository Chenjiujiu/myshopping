"use strict";
//cookie判断
~function(){
	var uname = window.C.getCookie("uname");
	uname=decodeURIComponent(uname);
	if(uname !== 'undefined'){
		if(uname !== undefined){
			var str = "";
			var nowH = new Date().getHours();
			if(nowH >= 5 && nowH < 9){
				str = "早上好，<a href='#'>" + uname + "</a>";
			}else if(nowH >= 9 && nowH < 12){
				str = "上午好，<a href='#'>" + uname + "</a>";
			}else if(nowH >= 12 && nowH < 19){
				str = "下午好，<a href='#'>" + uname + "</a>";
			}else if(nowH >= 19 || nowH < 5){
				str = "晚上好，<a href='#'>" + uname + "</a>";
			}
			C("#welcome-uname").html(str);
			C(".topbar-login").hide().next().show();
		}else{
			C(".topbar-login").show().next().hide();
		}
	}else{
		C(".topbar-login").show().next().hide();
	}
}();
// 退出
~function(){
	C("#logout").click(function(){
		C.delCookie({
			"name":"uid",
			"path":"/"
		});
		C.ajax({
			url:'./data/logout.php',
			type:'get'
		});
		location.href = "./pass/login.html"
	});
}();

