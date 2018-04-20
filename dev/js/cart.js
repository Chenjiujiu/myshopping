"use strict";
//购物车
function Cart(){
	this.products = [];
	this.init();
}
Cart.prototype = {
	init:function(){
		this.getCart();
		this.getallprice();
		this.bindEvent();
		this.gosum();
	},
	//获取购物车数据
	getCart:function(){
		var that = this;
		C.ajax({
			type:"post",
			url:'./data/getcart.php',
			dataType:'json',
			fn:callback
		});
		function callback(data){
			for(var k in data){
				that.products[k] = new Product(data[k]);
			}
		}
	},
	getallprice:function(){
		var allprice = 0;
		for(var k in this.products){
			var obj = this.products[k];
			if(obj.checked){
				allprice += parseFloat(obj.getsum());
			}
		}
		allprice = C.float2(allprice);
		return allprice;
	},
	getallnum:function(){
		var allnum = 0;
		for(var k in this.products){
			var obj = this.products[k];
			if(obj.checked){
				allnum += parseInt(obj.data.num);
			}
		}
		return allnum;
	},
	bindDom:function(){
		C(".car-sum .info span").html(this.getallnum());
		C(".car-sum .allPrice span").html('¥' + this.getallprice());
	},
	bindEvent:function(){
		var that = this;
		// 全选
		C(".car-sum .allsele label").click(function(){
			// 自己变成选中
			C(this).addClass("checked").child("i").html("&#xe914;");
			// 反选清空选中
			C(".car-sum .inverse label").remClass("checked").child("i").html("&#xe913;");
			// 遍历所有添加选中
			for(var k in that.products){
				var obj = that.products[k];
				obj.checked = true;
				var dom = C(".check label", obj.dom.get(0));
				dom.addClass("checked").child("i").html("&#xe914;");
			}
			//重新绑定价格
			that.bindDom();
		});
		// 反选
		C(".car-sum .inverse label").click(function(){
			//清空全选
			C(".car-sum .allsele label").remClass("checked").child("i").html("&#xe913;");
			//切换自己
			if(C(this).hasClass("checked")){
				C(this).remClass("checked").child("i").html("&#xe913;");
			}else{
				C(this).addClass("checked").child("i").html("&#xe914;");
			}
			// 切换产品
			for(var k in that.products){
				var obj = that.products[k];
				obj.checked = !obj.checked;
				var dom = C(".check label", obj.dom.get(0));
				if(dom.hasClass('checked')){
					dom.remClass("checked").child("i").html("&#xe913;");
				}else{
					dom.addClass("checked").child("i").html("&#xe914;");
				}
			}
			//重新绑定数据
			that.bindDom();
		})
	},
	gosum:function(){
		var that=this;
		C('.car-sum .sum-btn').click(function(e){
			C.prevDef(e);
			//提交订单
			var cartlist=[];
			for(var k in that.products){
				if(that.products[k].checked){
					cartlist.push({
						sid:that.products[k].data.sid,
						count:that.products[k].data.num
					})
				}
			}
			C.ajax({
				url:'./data/addorder.php',
				data:{data:JSON.stringify(cartlist)},
				type:'post',
				fn:function(data){
					console.log(data);
				}
			});

			console.log(cartlist);
			// 跳转到订单页面
			// location.href="./order.html"
		})
	}
};

//产品
function Product(data){
	this.data = data;
	this.init();
	this.dom;
	this.timer = null;
	this.checked = false;
}
Product.prototype = {
	// 初始化
	init:function(){
		this.creatDom();
		this.bindEvent();
		this.bindDom();
	},
	temp:
		'<ul class="clearfix"> <li class="check"><input type="radio" id="pro-check#{sid}"> <label for="pro-check#{sid}"><i class="icon-font">&#xe913;</i></label></li> <li class="item"> <div class="item-pic"> <img src="images/#{pic}"> </div> <div class="item-info"> <p>#{name}&nbsp;#{color}&nbsp#{size}</p> </div> </li> <li class="info"> <p>颜色：#{color}</p> <p>尺码：#{size}</p> </li> <li class="price"> <p class="price-del"><del>¥#{delprice}</del></p> <p>¥#{price}</p> </li> <li class="nums"> <a href="#" class="nums-redus">-</a> <input  type="text" class="nums-num" value="#{num}"> <a href="#" class="nums-add">+</a> </li> <li class="sum"> <span>¥0.00</span> </li> <li class="del"> <a href="#">删除&nbsp;x</a> </li> </ul>'
	,
	//计算总价
	getsum:function(){
		var sum = parseFloat(this.data.num * this.data.price);
		sum = Math.ceil(sum * 100) / 100;
		var sumarr = sum.toString().split(".");
		if(sumarr.length === 1){
			sum = sum.toString() + ".00";
			return sum;
		}
		if(sumarr.length > 1){
			if(sumarr[1].length < 2){
				sum = sum.toString() + "0";
			}
			return sum
		}
	},
	//绑定数据
	creatDom:function(){
		this.dom = C('<div></div>').addClass("pro-item");
		this.dom.bindHtml(this.temp, this.data);
		C(".sum span", this.dom.get(0)).html('¥' + this.getsum());
	},
	//绑定事件
	bindEvent:function(){
		var that = this;
		var sum = C(".sum span", this.dom.get(0));
		var num = C(".nums .nums-num", this.dom.get(0));
		// 删除
		C(".del", this.dom.get(0)).click(function(e){
			C.prevDef(e);
			C(".mod-box").show();
			C(".mod-box .ctrl .ok").one(function(){
				that.updata(that.data.sid, 0);
				C('#pro-list').get(0).removeChild(that.dom.get(0));
				delete car.products[that.data.sid];
				car.bindDom();
				C(".mod-box").hide();
			});
		});
		// 修改数量
		C(".nums .nums-redus", this.dom.get(0)).click(function(e){
			C.prevDef(e);
			if(num.val() <= 1){
				return false;
			}else{
				that.data.num--;
				num.val(that.data.num);
				sum.html('¥' + that.getsum());
				clearTimeout(that.timer);
				that.timer = setTimeout(function(){
					that.updata(that.data.sid, num.val());
					car.bindDom();
				}, 500);
			}
		});
		C(".nums .nums-add", this.dom.get(0)).click(function(e){
			C.prevDef(e);
			that.data.num++;
			num.val(that.data.num);
			sum.html('¥' + that.getsum());
			clearTimeout(that.timer);
			that.timer = setTimeout(function(){
				that.updata(that.data.sid, num.val());
				car.bindDom();
			}, 500);
		});
		num.on('blur', function(){
			num.val(num.val().replace(/[^\d]/g, ""));
			that.data.num = num.val();
			sum.html('¥' + that.getsum());
			that.updata(that.data.sid, num.val());
			car.bindDom()
		});
		// 选中
		C(".check label", this.dom.get(0)).click(function(){
			if(C(this).hasClass("checked")){
				// 清空自己
				C(this).remClass("checked").child("i").html("&#xe913;");
				//清空全选
				C(".car-sum .allsele label").remClass("checked").child("i").html("&#xe913;");
				that.checked = false;
			}else{
				C(this).addClass("checked").child("i").html("&#xe914;");
				that.checked = true;
			}
			car.bindDom()
		})
	},
	updata:function(sid, num, fn){
		C.ajax({
			type:"post",
			url:'./data/updata.php',
			data:{sid:sid, num:num},
			fn:function(data){
				console.log("数据库操作"+data);
			}
		});
	},
	bindDom:function(){
		C('#pro-list').get(0).appendChild(this.dom.get(0));
	},
};

var car = new Cart();

//模态框
~function(){
	C(".mod-box .ctrl .cancel").click(function(){
		C(".mod-box").hide();
	});
	C(".mod-box .close").click(function(){
		C(".mod-box").hide();
	});
	C('.mod-box').click(function(e){
		if(	C.target(e)===this){
			C('.mod-box').hide()
		}
	})
}();
