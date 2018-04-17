"use strict";
// 首页楼层对象
function Floor(floor){
	this.floor=floor;
	this.init();
}
Floor.prototype = {
	//初始化
	init:function(){
		this.getData();
	},
	//dom
	config:{},
	//获取数据
	getData:function(){
		var that=this;
		C.ajax({
			url:'./data/index_floor.php',
			type:'post',
			dataType:'json',
			data:{floor:that.floor},
			fn:function(data){
				console.log(data);
			}
		})
	},
	//数据绑定
	bindDom:function(){

	},
	//事件绑定
	bindEvent:function(){

	}
};
