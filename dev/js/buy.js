"use strict";
~function(){
	var sid = C.getserch("sid");
	C.ajax({
		url:'./data/buy.php',
		type:'get',
		dataType:'json',
		data:{"sid":sid},
		fn:callback
	});
	function callback(data){
		console.log(data);
	}
}();
