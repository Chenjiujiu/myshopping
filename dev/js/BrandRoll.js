"use strict";
// 品牌滚动对象
function BrandRoll(data){
	// 数据
	this.data = data;
	// 要绑定的dom的父元素
	this.doms = "#brand-list";
	//单个项的宽度
	this.width = 90;
	//单个模板
	this.item = '<li class="brand-item"><a href="./search.html?bid=#{bid}"><img src="./images/#{logo}"><span class="brand-name">#{name}</span></a></li>';
	this.start = {left:0};
	this.targent = {left:-parseInt(this.width * this.data.length) + parseInt(C(this.doms).parent().get(0).offsetWidth)};
	this.timer;//定时器开关
	this.current = 0;//当前位置
	this.time = 20;
	this.step = 2;
}
BrandRoll.prototype = {
	//初始化
	init:function(){
		this.bindDoms();
		this.bindevent();
	},
	// 绑定数据
	bindDoms:function(){
		C(this.doms).bindHtml(this.item, this.data).css("width", this.width * this.data.length + 'px');
	},
	//绑定事件
	bindevent:function(){
		C(this.doms).animate({targent:this.targent, time:this.time, step:this.step, avg:true, infi:true, start:this.start})
			.mEnter(function(){
				C(this).stop();
			})
			.drag({y:false,over:true})
			.mLeave(function(){
				C(this).start();
			});
		C(this.doms + " a").click(function(ev){
			C.prevDef(ev)
		}).on('dblclick',function(){
			location.href=this.href;
		})
	}
};