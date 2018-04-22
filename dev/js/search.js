"use strict";
//搜索页面
//单个产品对象
function Products(data){
	this.data = data;
	this.dom;
	this.fid = data.fid;
	this.zid = data.zid;
	this.cid = data.cid;
	this.init();
}
Products.prototype = {
	init:function(){
		this.bindDom();
		this.bindEvent();
	},
	temp:'<div class="img"><img src="./images/#{pic}"></div><h3 class="price"><em>¥</em>#{price}</h3> <p class="desc">#{name}</p> <p class="comm">已有<span>100+</span>条评论</p> <div class="btn"> <a href="#" class="like"><i class="icon-font">x</i>关注</a> <a href="#" class="add2car"><i class="icon-font">&#xe905;</i>加入购物车</a> </div>',
	bindDom:function(){
		this.dom = C("<div></div>").addClass("product-item");
		this.dom.bindHtml(this.temp, this.data);
	},
	bindEvent:function(){
		var that = this;
		C(".add2car", this.dom.get(0)).click(function(){
			C.ajax({
				url:"./data/addcar",
				type:'post',
				data:{
					fid:that.fid,
					cid:that.cid,
					zid:that.zid,
					num:1
				},
				fn:function(data){
					console.log(data);
				}
			})
		});
		C(".like", this.dom.get(0)).click(function(){
			console.log("like");
		})
	}
};

// 搜索框盒子对象
function SearchBox(){
	this.pno = 1;
	this.nums = 5;
	this.keywords = [];
	this.dom = C("<div></div>");
	this.data;
}
SearchBox.prototype = {
	//初始化
	init:function(){
		this.getpros();
	},
	//获取产品
	getpros:function(){
		var that = this;
		C.ajax({
			url:'./data/search.php',
			type:'get',
			data:{keywords:that.keywords, pno:that.pno, nums:that.nums},
			dataType:'json',
			fn:function(data){
				that.data = data;
				that.bindProducts();
			}
		});
	},
	//绑定产品
	bindProducts:function(){
		console.log(this.data);
		//循环生成产品对象并添加到临时dom
		for(var i = 0, len = this.data.length; i < len; i++){
			var product = new Products(this.data[i]);
			this.dom.get(0).appendChild(product.dom.get(0))
		}
		//循环结束把临时dom绑定到页面
		C('#product-list').html(this.dom.html())
	},
	//绑定翻页按钮
	bindCtrlDom:function(){

	},
	//绑定翻页按钮事件
	bindCtrlEvent:function(){

	}
};

// 页面事件
~function(){
	var keywords = C.getserch();
	if(keywords.keywords){
		keywords = keywords.keywords.replace(/\s+/g, " ").split(" ");
		var search = new SearchBox();
		search.keywords = keywords;
		search.init();
	}
}();




