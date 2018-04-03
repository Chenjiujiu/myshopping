/**
 * @描述: login
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */
~function(){
	/*切换二维码登录*/
	C('#go_erw').click(function(){
		C('.password-login').hide();
		C('.ewm-login').show();
	});
	/*切换密码登录*/
	C('#go_pwd').click(function(){
		C('.ewm-login').hide();
		C('.password-login').show();
	});
}();

~function(){
	/*用户名格式验证*/
	var flag = false;	//btn可用标志位
	var doms = C(".password-login .uname .tips-error");
	C('#uname').on("blur", function(){
		var reg = /^[a-zA-Z]\w{4,19}$/;
		if(!reg.test(this.value)){
			doms.html('账号格式错误,以字母开头5-20位字母数字组合').css("opacity", '1');
			flag = false;
		}else{
			doms.html(' ').css("opacity", '0');
			flag = true;
		}
	});
	/*登录提交验证*/
	C("#submit").click(function(){
		if(flag){
			var uname = C("#uname").val();
			var upwd = C("#upwd").val();
			var callback = function(data){
				console.log(data);

				if(data.flag){
					window.location.href="../index.html";
				}else{
					doms.html('用户名或密码错误!').css("opacity","1");
					flag=false;
				}
			};
			C.ajax({
				type:'get',
				url:'../data/login.php',
				data:"uname='" + uname+"'",
				fn:callback
			});
		}
	})
}();
