"use strict";
// 首页楼层对象
function Floor(){
	this.class = 1;
	this.init();
}
Floor.prototype = {
	//初始化
	init:function(){
		this.getData(1);
		this.getData(2);
		this.getData(3);
		this.getData(4);
		this.getData(5);
		this.getData(6);
		this.bindEvent();
	},
	//dom
	config:{
		floorBox:C("#floorBox"),//楼层父盒子
		table_nav_box:C("#table-nav-box") //选项卡盒子
	},
	temp:{
		// 大图模板
		bigPic:'<a href="#{href}"><img src="./images/#{pic}" alt=""></a>',
		// 小图模板
		smallPic:'<li class="prod-item item-common"><div class="img"><a href="#{href}"><img src="./images/#{pic}" alt=""></a></div><h3 class="title"><a href="#">#{title}</a></h3> <p class="price">#{price}元起</p> <div class="flag-#{tagType}">#{tag}</div> </li>',
		//推荐模版
		commTemp:'<li class="prod-item item-common item-big"> <div class="img"> <a href="#{href}"><img src="./images/#{pic}" alt=""></a> </div> <h3 class="title"><a href="#">{title}</a></h3> <p class="price">#{price}元起 </p> <div class="flag-reduce"> #{tag}</div> </li>',
		//选项卡模板
		table_nav:'<li class="nav-item"><a href="#">#{title}</a></li>'
	},
	//获取数据
	getData:function(floor){
		var that = this;
		C.ajax({
			url:'./data/index_floor.php',
			type:'post',
			dataType:'json',
			data:{floor:floor, class:that.class},
			fn:function(data){
				that.bindDom(data,floor)
			}
		})
	},
	//数据绑定
	bindDom:function(data,floor){
		var obj = this.config.floorBox.child().get(floor - 1);
		if(data.type == 1){
			//绑定大图
			C(".bind-big", obj).bindHtml(this.temp.bigPic, data.big);
			C(".bind-small", obj).bindHtml(this.temp.smallPic, data.small);
		}else if(data.type == 3){
			C(".bind-small", obj).bindHtml(this.temp.smallPic, data.small);
		}else if(data.type == 4){
			var comm = new ScroolPic(data.small);
			comm.config = {
				ctrl_prev:C(".ctrl-prve", obj),	//上一个按钮
				ctrl_next:C(".ctrl-next", obj),	//下一个按钮
				pic_box:C(".bind-comm", obj)	//图片列表盒子
			};
			comm.temp = this.temp.smallPic;
			comm.itemMagin = 10;
			comm.step = 3;
			comm.init();
		}else if(data.type == 2){
			C(".bind-big", obj).bindHtml(this.temp.bigPic, data.big);
			C(C(".bind-small", obj).get(data.class - 1)).bindHtml(this.temp.smallPic, data.small);
		}
	},
	//事件绑定
	bindEvent:function(){
		var that=this;
		var objs=C('a',this.config.table_nav_box.get(0));
		var obj = this.config.floorBox.child().get(3);
		objs.click(function(e){
			var clickBigbox=C(C(".bind-small", obj).get(this.cIndex));
			C.prevDef(e);
			if(clickBigbox.child().leng()===0){
				that.class=C(this).attr("href");
				that.getData(4);
			}
			objs.remClass('nav-current');
			C(this).addClass('nav-current');
			C(".bind-small", obj).hide();
			clickBigbox.show();
		})
	}
};
