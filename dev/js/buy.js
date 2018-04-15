"use strict";
// 商品信息加载
~function(){
	var fid = C.getserch("fid");
	C.ajax({
		url:'./data/buy.php',
		type:'post',
		data:{"fid":fid},
		dataType:"json",
		fn:callback
	});
	function callback(data){
		console.log(data);
		window.a=data;
		new Product(data);
	}
}();


