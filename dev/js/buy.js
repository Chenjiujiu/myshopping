"use strict";
// 商品信息加载
var fid = C.getserch("fid");
~function(){
	C.ajax({
		url:'./data/buy.php',
		type:'post',
		data:{"fid":fid},
		dataType:"json",
		fn:callback
	});
	function callback(data){
		window.a = data;
		new Product(data);
	}
}();
//页面基本效果
~function(){
	var show_tab = C("#pro-show-tab");
	var show_box = C("#pro-show-box");
	show_tab.child().click(function(){
		show_tab.child().remClass('current');
		C(this).addClass('current');
		show_box.child().hide();
		C(show_box.child().get(this.cIndex)).show()
	}, true);
	var getCommenntDate = true;
	show_tab.child().click(comm);
	function comm(){
		if(this.cIndex === 1 && getCommenntDate){
			getCommenntDate = false;
			show_tab.child().un("click",comm);
			new Comment(fid);
		}
	}
}();

