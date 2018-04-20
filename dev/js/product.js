"use strict";
// 产品对象
function Product(){
	//产品类别
	this.fid = '';
	//详细信息
	this.order = {};
	//尺码
	this.size = [];
	//颜色
	this.color = [];
	//产品图片
	this.pic = [];
	//详细图片
	this.order_pic = [];
	//颜色对应的尺码
	this.allZid = [];
}
Product.prototype = {
	// 初始化
	init:function(){
		this.bindBacis();
		this.bindOrder();
		this.bindPic(this.pic[this.color[0].cid]);
		this.bindColorEvent();
		this.bindSizeEvent();
		this.bindOrderImg();
	},
	//dom元素集合
	config:{
		choose_title:C("#choose_info .choose-title"),//标题dom
		bid_price:C("#choose_info .bid-price-n"),	//原价dom
		jf_price:C("#choose_info .jf-price-n"),	//疾风价dom
		spare:C("#choose_info .spare"),//省钱
		promo:C("#choose_info .promo"),	//活动dom
		size_list:C("#choose_info .size-list"),	//尺码dom
		color_list:C("#choose_info .color-list"),	//颜色dom
		order_info:C('#order-info'),	//详细参数列表
		show_info_pic:C('#show-info-pic'),	//详细参数列表
		order_pic:C('#show-info-pic .img-box'),	//详细参数列表
		mini_list:C("#mini-list"),// 小图片容器
		big_pic:C(".view-main img"),// 大图片
		nums:C(".choose-info .choose-nums .numble"),// 大图片
		buy_tip:C(".pro-choose .choose-info .buy-tip") //提示
	},
	//模板集合
	temp:{
		//标题模板
		choose_title:'<span class=\"title-brand\">#{brand}</span>#{name}',
		//原价模板
		bid_price:'<del class="bid-price-n">¥#{delprice}</del>',
		//疾风价模板
		jf_price:'<span class="jf-price-n"><i>¥</i>#{price}</span>',
		//活动模板
		promo:'<span class="promo-item">#{tag}</span>',
		//尺码模板
		size_list:'<li class="size-item" data-zid="#{zid}">#{size}<i></i></li>',
		//颜色模板
		color_list:'<li class="color-item" data-cid="#{cid}"><img src="./images/#{img}" alt=""><span>#{color}</span></li>',
		//商品详细信息模板
		order_info:'<tr> <td>品牌</td> <td>#{brand}</td> <td>分类</td> <td>#{type}</td> <td>产地</td> <td>#{origin}</td> </tr> <tr> <td>性别</td> <td>#{sex}</td> <td>鞋面材质</td> <td>#{trsture}</td> <td>上市时间</td> <td>#{time}</td> </tr> <tr> <td>鞋帮款式</td> <td>#{height}</td> <td>功能</td> <td>#{fun}</td> <td>闭合方式</td> <td>#{close}</td> </tr>',
		//商品详细介绍图片模板
		order_pic:'<img src="./images/#{pic}" alt="">'
	},
	//绑定基本信息
	bindBacis:function(){
		this.config.choose_title.bindHtml(this.temp.choose_title, this.order);//绑定标题
		this.config.bid_price.bindHtml(this.temp.bid_price, this.order);//绑定原价
		this.config.jf_price.bindHtml(this.temp.jf_price, this.order);//绑定疾风价
		// 绑定优惠
		var spare = parseFloat(this.order.delprice) - parseFloat(this.order.price);
		this.config.spare.html("省" + spare);
		//绑定活动标签
		var promos = this.order.tag.split('/');
		var proHtml = '<span class="title">活&nbsp;&nbsp;&nbsp;&nbsp;动：</span>';
		proHtml += C.tempStr(this.temp.promo, promos);
		this.config.promo.html(proHtml);
		//绑定尺码
		this.config.size_list.bindHtml(this.temp.size_list, this.size);
		//绑定颜色
		this.config.color_list.bindHtml(this.temp.color_list, this.color)
	},
	//绑定详细参数
	bindOrder:function(){
		this.config.order_info.bindHtml(this.temp.order_info, this.order)
	},
	// 绑定图片
	bindPic:function(data){
		var scroolpic = new ScroolPic(data);
		scroolpic.init();
		var that = this;
		this.config.mini_list.child().click(function(){
			C(this).sibl().remClass("current");
			C(this).addClass("current");
			var src = C(this).attr("data-m");
			that.config.big_pic.attr("src", src)
		});
		this.config.mini_list.child().get(0).click();
	},
	//绑定颜色单击事件
	bindColorEvent:function(){
		var that = this;
		this.config.color_list.child().click(function(){
			if(C(this).hasClass("current")){
				return false;
			}else{
				C(this).sibl().remClass("current");
				C(this).addClass("current");
				var cid = C(this).attr("data-cid");
				that.config.color_list.attr('select-cid', cid);
				that.bindPic(that.pic[cid]);
				that.hasSize(cid)
			}
		})

	},
	hasSize:function(cid){
		var sizes = this.config.size_list;
		var allZid = this.allZid[cid].allZid;
		sizes.child().addClass("no-size");
		var data = ";" + allZid + ";";
		for(var i = 0, len = sizes.child().leng(); i < len; i++){
			var item = C(sizes.child().get(i));
			var zid = ";" + item.attr("data-zid") + ";";
			if(data.indexOf(zid) !== -1){
				item.remClass("no-size");
			}else{
				if(this.config.size_list.attr("select-zid")===item.attr("data-zid")){
					this.config.size_list.attr("select-zid", 'null');
					item.remClass("current");
				}
			}
		}
	},
	//尺码点击事件
	bindSizeEvent:function(){
		var that = this;
		this.config.size_list.child().click(function(){
			if(C(this).hasClass("current") || C(this).hasClass("no-size")){
				return false;
			}else{
				var zid = C(this).attr("data-zid");
				that.config.size_list.attr("select-zid", zid);
				C(this).sibl().remClass("current");
				C(this).addClass("current");
			}
		})
	},
	bindOrderImg:function(){
		var top = this.config.show_info_pic.get(0).offsetTop - C.windowH();
		var flag = true;
		C(window).on("scroll", loadImg);
		var that = this;
		function loadImg(){
			if(C.scrollTop() >= top && flag){
				flag = false;
				C(window).un("scroll", loadImg);
				that.config.order_pic.bindHtml(that.temp.order_pic, that.order_pic)
			}
		}
	},
	//购买
	buyNow:function(){
		console.log("购买");
	},
	// 添加购物车
	add2car:function(){
		var fid = this.fid;
		var cid = this.config.color_list.attr('select-cid');
		var zid = this.config.size_list.attr("select-zid");
		var num = this.config.nums.val();
		var uname=window.C.getCookie("uname");
		var that=this;
			if(cid&&zid&&num){
				C.ajax({
					url:'./data/addcar.php',
					type:'post',
					data:{uname:uname,fid:fid, cid:cid, zid:zid, num:num},
					fn:callback
				});
			}else{
				C('.tip-error').show()
			}
		function callback(data){
			if(data==='ok'){
				C('.tip-gocar').show()
			}else{
				C('.tip-error').show()
			}
		}

	}
};



