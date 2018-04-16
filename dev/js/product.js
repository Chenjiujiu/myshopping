"use strict";
// 产品对象
function Product(data){
	this.data = data;
	this.init();
}
Product.prototype = {
	// 初始化
	init:function(){
		this.bindProduct();
		this.bindImages();
		this.bindImagesEvent();
		this.add2car();
		this.bindOrder();
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
	},
	//绑定模板
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
	// 绑定基本信息
	bindProduct:function(){
		this.config.choose_title.bindHtml(this.temp.choose_title, this.data.order);//绑定标题
		this.config.bid_price.bindHtml(this.temp.bid_price, this.data.order);//绑定原价
		this.config.jf_price.bindHtml(this.temp.jf_price, this.data.order);//绑定疾风价
		// 绑定优惠
		var spare = parseFloat(this.data.order.delprice) - parseFloat(this.data.order.price);
		this.config.spare.html("省" + spare);
		//绑定活动标签
		var promos = this.data.order.tag.split('/');
		var proHtml = '<span class="title">活&nbsp;&nbsp;&nbsp;&nbsp;动：</span>';
		proHtml += C.tempStr(this.temp.promo, promos);
		this.config.promo.html(proHtml);
		//绑定尺码
		this.config.size_list.bindHtml(this.temp.size_list, this.data.allSize);
		//绑定颜色
		this.config.color_list.bindHtml(this.temp.color_list, this.data.allColor)
		//绑定路径

	},
	// 绑定图片信息
	bindImages:function(){

	},
	// 绑定图片事件
	bindImagesEvent:function(){

	},
	// 添加购物车
	add2car:function(){

	},
	//	绑定详细参数
	bindOrder:function(){
		this.config.order_info.bindHtml(this.temp.order_info, this.data.order)
	},
	//绑定商品图片
	bindOrderImg:function(){
		var top = this.config.show_info_pic.get(0).offsetTop - C.windowH();
		var flag = true;
		C(window).on("scroll", loadImg);
		var that = this;
		function loadImg(){
			if(C.scrollTop() >= top && flag){
				flag = false;
				C(window).un("scroll", loadImg);
				that.config.order_pic.bindHtml(that.temp.order_pic, that.data.order_pic)
			}
		}
	}
};