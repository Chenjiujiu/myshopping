"use strict";
//搜索页面
//单个产品对象
function Products(data){
	this.data = data;
	this.sid = data.sid;
	this.dom;
	this.init();
	this.timer = null;
}
Products.prototype = {
	init:function(){
		this.bindDom();
		this.bindEvent();
	},
	temp:'<div class="img"><a href="./buy.html?fid=#{fid}"><img src="./images/#{pic}"></a></div><h3 class="price"><em>¥</em>#{price}</h3><p class="info">#{bname}&nbsp;#{color}&nbsp;#{size}码</p> <p class="name">#{name}</p> <p class="comm">已有<span>100+</span>条评论</p> <div class="btn"> <a href="#" class="like"><i class="icon-font">x</i>关注</a> <a href="#" class="add2car"><i class="icon-font">&#xe905;</i>加入购物车</a> </div><div class="tip">添加成功</div>',
	bindDom:function(){
		this.dom = C("<div></div>").addClass("product-item");
		this.dom.bindHtml(this.temp, this.data);
	},
	bindEvent:function(){
		var that = this;
		var tip = C(".tip", that.dom.get(0));
		C(".add2car", this.dom.get(0)).click(function(e){
			C.prevDef(e);
			clearTimeout(that.timer);
			C.ajax({
				url:"./data/addcar.php",
				type:'post',
				data:{
					sid:that.sid,
					num:1
				},
				fn:function(data){
					if(data === "ok"){
						tip.html("添加成功").show();
					}else if(data === "nologin"){
						C("#tip-login").show();
					}else{
						tip.html("添加失败").show();
						that.timer = setTimeout(function(){
							tip.hide();
						}, 1000)
					}
				}
			})
		});
		C(".like", this.dom.get(0)).click(function(e){
			C.prevDef(e);
			console.log("like");
		})
	}
};

// 搜索框盒子对象
function SearchBox(){
	this.pno = 1;
	this.nums = 5;
	this.dom = C("<div></div>");
	this.data;
	this.searchInfo = {};
	this.searchInfo.keywords = [];
	this.searchInfo.proper = {};
	this.searchInfo.prolength = 0;
}
SearchBox.prototype = {
	//初始化
	init:function(){
		this.getpros();
		this.selectWords();
		this.bindWordsEvent();
	},
	config:{
		//关键字显示列表
		showWordsList:C("#showWordsList"),
		//关键字列表li
		selectWordsli:C(".search-header  .sele-content a")
	},
	//获取产品
	getpros:function(){
		var that = this;
		var searchInfo = JSON.stringify(this.searchInfo);
		C.ajax({
			url:'./data/search.php',
			type:'post',
			data:{searchInfo:searchInfo, pno:that.pno, nums:that.nums},
			dataType:'json',
			fn:function(data){
				that.data = data;
				that.bindProducts();
				that.bindNums();
			}
		});
	},
	//绑定产品
	bindProducts:function(){
		//循环生成产品对象并添加到临时dom
		this.dom.get(0).innerHTML = "";
		if(this.data.proNums===0){
			C(".search .search-box .content")
				.html('<div class="search-no"><span>未搜索到符合条件的商品！</span></div>');
		}else{
			for(var i = 0, len = this.data.products.length; i < len; i++){
				var product = new Products(this.data.products[i]);
				this.dom.get(0).appendChild(product.dom.get(0))
			}
			//循环结束把临时dom绑定到页面
			C('#product-list').get(0).innerHTML = "";
			C('#product-list').get(0).appendChild(this.dom.get(0));
		}
	},
	//绑定翻页按钮
	bindCtrlDom:function(){

	},
	//绑定翻页按钮事件
	bindCtrlEvent:function(){

	},
	//绑定搜索关键字
	bindselectWords:function(){
		var html = '';
		for(var k in this.searchInfo.proper){
			var v = this.searchInfo.proper[k].value;
			html += '<li><span class="title">' + k + ':</span> <span class="txt">' + v + '</span><i class="icon-font close">&#xe90d;</i></li>';
		}
		this.config.showWordsList.html(html);
		if(JSON.stringify(this.searchInfo.proper) === '{}'){
			return false;
		}else{
			this.searchInfo.keywords = [];
			this.getpros();
		}
	},
	//绑定搜索关键字事件
	bindWordsEvent:function(){
		var that = this;
		this.config.showWordsList.click(function(e){
			var tar = C.target(e);
			if(C(tar).hasClass("close")){
				var key = C(tar).sibl(".title").html().slice(0, -1);
				that.searchInfo.proper[key].father.show();
				delete that.searchInfo.proper[key];
				that.searchInfo.prolength = that.searchInfo.prolength - 1;
				that.bindselectWords();
			}
		});
		C("#reset").click(function(){
			for(var k in that.searchInfo.proper){
				that.searchInfo.proper[k].father.show();
			}
			that.searchInfo.proper = {};
			that.searchInfo.prolength = 0;
			that.bindselectWords();
		})
	},
	//选择搜索项
	selectWords:function(){
		var that = this;
		this.config.selectWordsli.click(function(e){
			C.prevDef(e);
			var key = C(this).parent(".sele").child(".sele-title").html();
			if(C(this).hasClass("btn-price")){
				var min = C(this).sibl(".minprice").val();
				var max = C(this).sibl(".maxprice").val();
				if(min && max){
					var price = min + '-' + max;
					C(this).attr("data-name", price);
				}else{
					return false;
				}
			}
			var value = {};
			value.key = C(this).parent(".sele").attr("data-key");
			value.value = C(this).attr("data-value");
			value.father = C(this).parent(".sele");
			delete that.searchInfo.proper[key];
			that.searchInfo.proper[key] = value;
			that.searchInfo.prolength = that.searchInfo.prolength + 1;
			that.bindselectWords();
			C(this).parent(".sele").hide();
		})
	},
	//绑定上面的数量以及页面
	bindNums:function(){
		C(".search .search-box .info .top-nums").html(this.data.proNums);
		C(".search .search-box .info .top-pages").html(this.data.now+"/"+this.data.pages);
	}
};

// 页面事件
~function(){
	var keywords = C.getserch();
	if(keywords.keywords){
		keywords = keywords.keywords.replace(/\s+/g, " ").split(" ");
		var search = new SearchBox();
		search.searchInfo.keywords = keywords;
		search.init();
	}
	C(".selection-price .sele-in input").on("keyup", function(){
		this.value = this.value.replace(/\D/g, "");
	})
}();

//模态框
~function(){
	C(".mod-box .close").click(function(){
		C(".mod-box").hide()
	});
	C('.mod-box').click(function(e){
		if(C.target(e) === this){
			C('.mod-box').hide()
		}
	})
}();



