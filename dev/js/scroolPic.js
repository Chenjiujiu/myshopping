"use strict";
//z左右滚动对象
var ScroolPic = function(data){
	this.data=data;
	this.config = {
		bigBox:C("#choose-view .view-mini"),	//最外层大盒子
		ctrl_prev:C("#choose-view .mini-prev"),	//上一个按钮
		ctrl_next:C("#choose-view .mini-next"),	//下一个按钮
		pic_box:C("#choose-view .mini-list")	//图片列表盒子
	};
	this.temp='<li class="mini-item" data-m="./images/#{m}"><img src="./images/#{s}"></li>';//图片元素模板
	this.itemW=88;	//当个图片高度
};
ScroolPic.prototype = {
	init:function(){
		this.bindImg();
		this.bindEvent();
	},
	//绑定图片
	bindImg:function(){
		var maxW = this.itemW*this.data.length + 'px';
		this.config.pic_box.css("width", maxW);
		this.config.pic_box.bindHtml(this.temp, this.data)
	},
	//绑定左右按钮事件
	bindEvent:function(){
		var that = this;
		var pic_cont_w=this.config.pic_box.parent().get(0).offsetWidth;
		var pic_box_w=this.config.pic_box.get(0).offsetWidth;
		var maxLeft=pic_cont_w-pic_box_w;
		var nowLeft = parseInt(this.config.pic_box.css("left"));
		this.config.bigBox.child().click(function(){
			if(maxLeft<0){
				if(this===that.config.ctrl_prev.get(0)){
					if(nowLeft >= 0){
						nowLeft = 0;
					}else{
						nowLeft = nowLeft + that.itemW;
					}
				}else if(this===that.config.ctrl_next.get(0)){
					if(nowLeft <= maxLeft){
						nowLeft = maxLeft;
					}else{
						nowLeft = nowLeft - that.itemW;
					}
				}else{
					return ;
				}
			}else{
				return ;
			}
			that.config.pic_box.animate({
				targent:{left:nowLeft},
				avg:true,
				time:10,
				step:1,
				fn:function(){
					console.log("ok");
				}
			});
		});
	}
};

