/**
 * @描述: login
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */
/*页面效果*/
~function(){
	/*切换二维码登录*/
	C('#go_erw').get(0).onclick = function(){
		C('.password-login').hide();
		C('.ewm-login').show();
	};
	/*切换密码登录*/
	C('#go_pwd').get(0).onclick = function(){
		C('.ewm-login').hide();
		C('.password-login').show();
	}
}();
/*用户名验证*/
~function(){

}();
/*密码验证*/
~function(){

}();