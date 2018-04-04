~function(w){
	//表单
	var unameFlag = false;	//用户名标志位
	var iphoneFlag = false;	//手机号标志位
	var codeFlag = false;	//验证码标志位
	var upwdFlag = false;	//密码标识位
	var verifyFlag = false;	//确认密码标识位
	var unameReg = /^[a-zA-Z]\w{4,19}$/;	//用户名正则
	var phoneReg = /^0?(1)[3-9][0-9]{9}$/;	//电话号码正则
	var upwdReg = /^\w{6,20}$/;	//密码正则
	var codeReg = /^\w{4}$/;	//验证码正则
	C(".regist-item input").on("focus", function(){
		C(this).next().css("left", "-80px").css("text-align", "right")
			.parent().sibl(".tips").show();
	});	//lable标签移动
	C("#uname-input").on("blur", function(){
		var tips = C(this).parent().next();
		if(this.value === ""){
			C(this).css("border-color", "#45a8ea");
			tips.class("tips")
				.child(".tips-words").html("以字母开头5-20位字母数字组合");
			unameFlag = false;
		}else if(!unameReg.test(this.value)){
			C(this).css("border-color", "#ff6c6c");
			tips.class("tips tips-error")
				.child(".tips-words").html("用户名格式错误");
			unameFlag = false;
		}else{
			var unametest = function(data){
				var input = C("#uname-input");
				if(data === "1"){
					input.css("border-color", "#ff6c6c");
					tips.class("tips tips-error")
						.child(".tips-words").html("用户名已存在");
					unameFlag = false;
				}else if(data === "0"){
					input.css("border-color", "#45a8ea");
					tips.class("tips tips-ok");
					unameFlag = true;
				}else{
					input.css("border-color", "#ff6c6c");
					tips.class("tips tips-error")
						.child(".tips-words").html("服务器正忙,请稍后再试");
					unameFlag = false;
				}
			};
			C.ajax({
				"type":"post",
				"url":"../data/inputTest.php",
				"data":{"uname":this.value},
				"fn":unametest
			});
		}
	});	//用户名验证
	C("#iphone-input").on("blur", function(){
		var tips = C(this).parent().next();
		if(this.value === ""){
			C(this).css("border-color", "#45a8ea");
			tips.class("tips")
				.child(".tips-words").html("11位手机号码");
			iphoneFlag = false;
		}else if(!phoneReg.test(this.value)){
			C(this).css("border-color", "#ff6c6c");
			tips.class("tips tips-error")
				.child(".tips-words").html("手机号码格式错误");
			iphoneFlag = false;
		}else{
			var phonetest = function(data){
				var input = C("#iphone-input");
				if(data === "1"){
					input.css("border-color", "#ff6c6c");
					tips.class("tips tips-error")
						.child(".tips-words").html("手机号码已被注册");
					iphoneFlag = false;
				}else if(data === "0"){
					input.css("border-color", "#45a8ea");
					tips.class("tips tips-ok");
					iphoneFlag = true;
				}else{
					input.css("border-color", "#ff6c6c");
					tips.class("tips tips-error")
						.child(".tips-words").html("服务器正忙,请稍后再试");
					iphoneFlag = false;
				}
			};
			C.ajax({
				"type":"post",
				"url":"../data/inputTest.php",
				"data":{"uphone":this.value},
				"fn":phonetest
			});
		}
	});	//电话号码验证
	C("#code-input").on("blur", function(){
		var tips = C(this).parent().sibl(".tips");
		if(this.value === ""){
			tips.class("tips");
			tips.child(".tips-words").html("请输入图片中的字符");
			codeFlag = false;
		}else if(!codeReg.test(this.value)){
			tips.class("tips tips-error")
				.child(".tips-words").html("验证码错误");
			codeFlag = false;
		}else{
			tips.class("tips tips-ok");
			codeFlag = true;

			/*var codetest=function(data){
				if(data==="1"){
					tips.class("tips tips-error");
					tips.child(".tips-words").html("验证码错误");
					codeFlag=false;
				}else if(data==="0"){
					tips.class("tips tips-ok");
					codeFlag=true;
				}
			};
			C.ajax({
				"type":"post",
				"url":"../data/register.php",
				"data":{"uphone":this.value},
				"fn":codetest
			});*/
		}
	});	//验证码验证==========还没写
	C("#upwd-input").on("blur", function(){
		var tips = C(this).parent().next();
		if(this.value === ""){
			C(this).css("border-color", "#45a8ea");
			tips.class("tips")
				.child(".tips-words").html("6-20个英文或数字组合");
			upwdFlag = false;
		}else if(upwdReg.test(this.value)){
			C(this).css("border-color", "#45a8ea");
			tips.class("tips tips-ok");
			upwdFlag = true;
		}else{
			C(this).css("border-color", "#ff6c6c");
			tips.class("tips tips-error")
				.child(".tips-words").html("密码格式错误");
			upwdFlag = false;
		}
		if(C("#verify-input").val() !== "" && this.value !== C("#verify-input").val()){
			C("#verify-input").css("border-color", "#ff6c6c")
				.parent().next().class("tips tips-error")
				.child(".tips-words").html("两次密码输入不相同");
			verifyFlag = false;
		}else if(C("#verify-input").val() !== "" && this.value === C("#verify-input").val()){
			C("#verify-input").css("border-color", "#45a8ea")
				.parent().next().class("tips tips-ok");
			verifyFlag = true;
		}
	});	//密码验证
	C("#verify-input").on("blur", function(){
		var tips = C(this).parent().next();
		if(this.value === ""){
			C(this).css("border-color", "#45a8ea");
			tips.class("tips")
				.child(".tips-words").html("请再次输入密码");
			verifyFlag = false;
		}else if(this.value === C("#upwd-input").val()){
			C(this).css("border-color", "#45a8ea");
			tips.class("tips tips-ok");
			verifyFlag = true;
		}else{
			C(this).css("border-color", "#ff6c6c");
			tips.class("tips tips-error")
				.child(".tips-words").html("两次密码输入不相同");
			verifyFlag = false;
		}
	});	//重复密码验证
	C("#submit-btn").click(function(){
		if(unameFlag && iphoneFlag && codeFlag && upwdFlag && verifyFlag){
			var uname = C("#uname-input").val();
			var iphone = C("#iphone-input").val();
			var upwd = C("#upwd-input").val();
			var callback = function(data){
				if(data.flag === 1){
					C(".succeed").show();
					C("body").css("overflow-x", "hidden");
					C.setCookie({"name":"uid", "value":data.uid, "days":30, "path":"/"});
					var span = C(".succeed .outtime");
					var time = 5;
					setInterval(function(){
						span.html(time - 1);
						if(span.html() <= 0){
							span.html(0);
							location.href = "../index.html";
						}
					}, 1000)
				}else{
					C(".error").show();
					C(document).click(modalBox);
				}
			};
			C.ajax({
				type:'post',
				url:'../data/register.php',
				data:{
					"uname":uname,
					"uphone":iphone,
					"upwd":upwd
				},
				dataType:"json",
				fn:callback
			});
		}
	});	//提交
	var modalBox = function(event){
		if(C.target(event) === C(".error").get(0)){
			C(".error").hide();
			C(document).un("click", modalBox);
		}
	};	//模态框

}(window);