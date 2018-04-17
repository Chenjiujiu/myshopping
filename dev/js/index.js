"use strict";
// 实例化轮播图和分类信息
~function(){
	C.ajax({
		url:"./data/index_slider.php",
		type:"get",
		data:{maxnum:6},
		dataType:"json",
		fn:callback
	});
	function callback(data){
		var slider=new Slider(data[0], "#mian_slider");
		slider.init();
		//绑定分类信息
		var item = '<li class="sort-item"><a href="#{href}"><img src="./images/#{img}" alt=""><span>#{title}</span></a></li>';
		C("#sort-list").bindHtml(item, data[1]);
	}
}();

// 实例化品牌滚动
~function(){
	C.ajax({
		url:"./data/shoes_brand.php",
		type:"get",
		data:'',
		dataType:"json",
		fn:callback
	});
	function callback(data){
		var branRoll=new BrandRoll(data);
		branRoll.init()
	}
}();

//实例化楼层导航
~function(){
	var floorNav=new FlootNav();
	floorNav.init();
}();

//实例化楼层
~function(){
	new Floor(1);
}();


