"use strict";
// 楼层导航
var FlootNav = function(){
	this.data = [];
	this.config = {
		// 楼层盒子dom
		floorBox:C("#floorBox"),
		floorItems:C("#floorBox").child(),
		//楼层导航
		floorNav:C("#floorNav"),
		//楼层导航盒子
		floorNavBox:C("#floorNavBox"),

		//楼层导航背景
		floorNavBg:C(".floorNav-bg"),
		floorNavItems:C("#floorNavBox").child()
	};
	this.items = '<li class="floorNav-item"><a href="javascript:void(0);">#{i}</a></li>';
	this.floorTimer = null;
	this.current = 0;
	this.targent = 0;
	this.leader = 0;
	this.windowY = 0;
};
FlootNav.prototype = {
	// 初始化
	init:function(){
		this.getdata();
		this.bindDom();
		this.bgAnimate();
		this.windowScroll();
		this.floorClick();
	},
	// 获取数据(楼层名字，首层为"导航" 最后一个为"TOP")
	getdata:function(){
		this.data.push("导航");
		var floorItems = this.config.floorBox.child();
		for(var i = 0, len = floorItems.leng(); i < len; i++){
			var title = C('.floor-title .title', floorItems.get(i)).txt();
			this.data.push(title)
		}
		this.data.push("TOP");
	},
	//绑定元素
	bindDom:function(){
		var str = '';
		for(var i = 0, len = this.data.length; i < len; i++){
			str += C.tempStr(this.items, this.data[i]);
		}
		this.config.floorNavBox.html(str);
	},
	// 点击导航动画
	floorClick:function(){
		var that = this;
		this.config.floorNavItems
			.mEnter(function(e){//鼠标进入存储值
				that.targent = this.offsetTop;
			})
			.mLeave(function(){//鼠标离开恢复值
				that.targent = that.current;
			})
			.click(function(){//鼠标点击保存值，同时滚动到相应楼层
				that.current = that.targent;
				if(this.cIndex === 0){
				}else if(this.cIndex === that.config.floorNavItems.leng() - 1){
					that.windowY = 0;
				}else{
					that.windowY = that.config.floorBox.child().get(this.cIndex-1).offsetTop - 80;
				}
				that.floorAnimate();
			});
	},
	//背景动画
	bgAnimate:function(){
		var that = this;
		var bg = this.config.floorNavBg.get(0);
		setInterval(function(){
			that.leader = that.leader + (that.targent - that.leader) / 20;
			if(Math.abs(that.targent - that.leader) < 2){
				that.leader = that.targent;
			}
			bg.style.top = that.leader + "px";
		}, 10)
	},
	//楼层动画
	floorAnimate:function(){
		var that = this;
		var current = C(window).scrollTop();
		this.floorTimer = setInterval(function(){
			current = current + (that.windowY - current) / 10;
			if(Math.abs(current - that.windowY) < 2){
				current = that.windowY;
			}
			window.scrollTo(0, current);
			if(current === that.windowY){
				clearInterval(that.floorTimer)
			}
		}, 10)
	},
	//屏幕滚动检测
	windowScroll:function(){
		var that = this;
		C(window).on("scroll", function(){
			var windowY = C.scrollTop();
			var floor1 = that.config.floorBox.child().get(0).offsetTop;
			var floorH=that.config.floorNavBox.get(0).offsetHeight;
			var windowH = C.windowH();
			// 导航是否显示
			if(windowY > floor1 - windowH / 2){
				that.config.floorNav.css("height", floorH+"px").css("width","40px");
			}else{
				that.config.floorNav.css("height", "0px").css("width","0px");
			}
			// 导航跟随楼层
			for(var i=0;i<that.config.floorItems.leng();i++){
				//top-Y=距离屏幕上 >  阀值  > top-y+h
				var item=that.config.floorItems.get(i);
				var top2scrren=item.offsetTop-windowY;
				var bottom2scrren=top2scrren+item.offsetHeight;
				if(top2scrren<windowH/2&&windowH/2<bottom2scrren){
					that.targent=that.config.floorNavItems.get(i+1).offsetTop;
					that.current=that.targent;
				}
			}
			
		})
	}
};