"use strict";
// 产品对象
function Product(fid){
	this.fid = fid;
	this.colorBtnFlag = true;
	this.init();
}
Product.prototype = {
	// 初始化
	init:function(){
		this.getProductData();
		this.getpicData(0);
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
		big_pic:C(".view-main img")// 大图片
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
	//获取商品基本信息
	getProductData:function(){
		var that = this;
		C.ajax({
			url:'./data/buy.php',
			type:'post',
			data:{"fid":that.fid},
			dataType:"json",
			fn:function(data){
				that.bindProduct(data);
				that.bindOrder(data);
				that.bindOrderImg(data);
				that.bindColorEvent();
			}
		});
	},
	//绑定基本信息
	bindProduct:function(data){
		this.config.choose_title.bindHtml(this.temp.choose_title, data.order);//绑定标题
		this.config.bid_price.bindHtml(this.temp.bid_price, data.order);//绑定原价
		this.config.jf_price.bindHtml(this.temp.jf_price, data.order);//绑定疾风价
		// 绑定优惠
		var spare = parseFloat(data.order.delprice) - parseFloat(data.order.price);
		this.config.spare.html("省" + spare);
		//绑定活动标签
		var promos = data.order.tag.split('/');
		var proHtml = '<span class="title">活&nbsp;&nbsp;&nbsp;&nbsp;动：</span>';
		proHtml += C.tempStr(this.temp.promo, promos);
		this.config.promo.html(proHtml);
		//绑定尺码
		this.config.size_list.bindHtml(this.temp.size_list, data.allSize);
		//绑定颜色
		this.config.color_list.bindHtml(this.temp.color_list, data.allColor)
		//绑定路径
	},
	//绑定详细参数
	bindOrder:function(data){
		this.config.order_info.bindHtml(this.temp.order_info, data.order)
	},
	//绑定商品图片
	bindOrderImg:function(data){
		var top = this.config.show_info_pic.get(0).offsetTop - C.windowH();
		var flag = true;
		C(window).on("scroll", loadImg);
		var that = this;
		function loadImg(){
			if(C.scrollTop() >= top && flag){
				flag = false;
				C(window).un("scroll", loadImg);
				that.config.order_pic.bindHtml(that.temp.order_pic, data.order_pic)
			}
		}
	},
	//获取图片基本信息
	getpicData:function(cid){
		var that = this;
		var isExist = C.getCookie(that.fid + "c" + cid);
		if(isExist === undefined){
			C.ajax({
				url:'./data/getPicData.php',
				type:'post',
				data:{fid:that.fid, cid:cid},
				dataType:"json",
				fn:function(data){
					//实力化一个左右滚动图
					C.setCookie({name:that.fid + "c" + cid, value:JSON.stringify(data)});
					var scroolpic = new ScroolPic(data.pic);
					scroolpic.init();
					that.bindImagesEvent();
					that.hasSize(data.allZid);
					that.colorBtnFlag = true;	//归零颜色按钮状态
				}
			})
		}else{
			var data = JSON.parse(isExist);
			var scroolpic = new ScroolPic(data.pic);
			scroolpic.init();
			that.bindImagesEvent();
			that.colorBtnFlag = true;	//归零颜色按钮状态
			that.hasSize(data.allZid)
		}
	},
	// 绑定图片事件
	bindImagesEvent:function(){
		//图片点击
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
			}else if(that.colorBtnFlag){
				that.colorBtnFlag = false;	//颜色按钮状态禁用
				var cid = C(this).attr("data-cid");
				that.getpicData(cid);	//重新获取数据并绑定
				C(this).sibl().remClass("current");
				C(this).addClass("current");
			}else{
				return false;
			}
		})

	},
	//尺码是否可用
	hasSize:function(data){
		console.log(data);
		var sizes = this.config.size_list;
		sizes.child().addClass("no-size");
		var data=";"+data+";";
		for(var i = 0, len = sizes.child().leng(); i < len; i++){
			var item=C(sizes.child().get(i));
			var zid=";"+item.attr("data-zid")+";";
			if(data.indexOf(zid)!==-1){
				item.remClass("no-size");
			}

		}
	},
	// 添加购物车
	add2car:function(){

	}

};