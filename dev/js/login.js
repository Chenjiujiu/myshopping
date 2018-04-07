/**
 * @描述: login
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */

// 页面
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
//表单
~function(){
	/*用户名格式验证*/
	var unameFlag = false;	//用户名标志位
	var upwdFlag=false;	//密码标识位
	var flag=false;	//公共标识位
	var unameReg = /^[a-zA-Z]\w{4,19}$/;
  var phoneReg = /^0?(1)[3-9][0-9]{9}$/;
  var upwdReg = /^\w{6,20}$/;
  var tip = C(".password-login .uname .tips-error");
  C('#uname').on("blur", function(){
		if(unameReg.test(this.value) ||phoneReg.test(this.value)){
			tip.html(' ').css("opacity", '0');
			unameFlag = true;
			flag = true;
		}else{
			tip.html('账号格式错误').css("opacity", '1');
			unameFlag = false;
		}
	});
	C('#upwd').on("blur", function(){
		if(upwdReg.test(this.value)){
			tip.html(' ').css("opacity", '0');
			upwdFlag = true;
			flag= true;
		}else{
			tip.html('密码格式错误!').css("opacity","1");
			upwdFlag=false;
		}
	});
	/*登录提交验证*/
	C("#submit").click(function(){
		if(unameFlag&&upwdFlag&&flag){
			var callback = function(data){
        console.log(data);
				if(data.flag===1){
					window.location.href="../index.html";
					C.setCookie({"name":"uid","value":data.uid,"days":30,"path":"/"});
				}else{
					tip.html('用户名或密码错误!').css("opacity","1");
					flag=false;
				}
			};
			C.ajax({
				type:'post',
				url:'../data/login.php',
				data:{"uname":C("#uname").val(),"upwd":C("#upwd").val()},
				dataType:"json",
				fn:callback
			});
		}
	})
}();
