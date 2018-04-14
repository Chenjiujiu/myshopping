"use strict";
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
	}
}();

