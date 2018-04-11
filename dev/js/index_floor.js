"use strict";
// 首页楼层对象
function Floor(data){
	this.data=data;
	this.config={}
}
Floor.prototype={
	//初始化
	init:function(){
		this.bindDom();
		this.bindevent();
	},
	//数据绑定
	bindDom:function(){

	}
	//事件绑定
};
