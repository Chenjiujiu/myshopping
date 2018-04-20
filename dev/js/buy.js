"use strict";
// 商品信息加载
~function(){
	var fid = C.getserch("fid");
	var product = new Product();
	C.ajax({
		url:'./data/buy.php',
		type:'post',
		data:{"fid":fid},
		dataType:"json",
		fn:function(data){
			product.fid = fid;
			product.order = data.order;
			product.size = data.allSize;
			product.color = data.allColor;
			product.allZid = data.allZid;
			product.order_pic = data.order_pic;
			product.pic=data.pic;
			product.init();
			// 路径绑定
			C("#buy_path .type").html(data.order.brand);
			C("#buy_path .brand").html(data.order.type);
			C("#buy_path .name").html(data.order.name);
			//购买按钮
			C(".choose-btn .buynow").click(function(e){
				C.prevDef(e);
				isLogin(function(){
					product.buyNow();
				});
			});
			//添加购物车
			C(".choose-btn .addcar").click(function(e){
				C.prevDef(e);
				isLogin(function(){
					product.add2car();
				});
			})
		}
	});

	function isLogin(ok){
			C.ajax({
				type:'get',
				url:'./data/islogin.php',
				dataType:'json',
				fn:callback
			});
			function callback(data){
				if(data.ok){
					ok();
				}else{
					C(".tip-login").show()
				}
			}
	}

}();

// 数量按钮
~function(){
		var btns=C(".choose-nums .nums-list");
		var num=C(".choose-nums .numble");
		btns.child().click(function(){
			var now=parseInt(num.val());
			if(C(this).hasClass("ctrl-red")){
				if(num.val()<=1){
					return false;
				}else{
					num.val(--now);
				}
			}else if(C(this).hasClass("ctrl-add")){
				num.val(++now);
			}
		});
}();

// 详情菜单切换
~function(){
	var fid = C.getserch("fid");
	var that = this;
	var show_tab = C("#pro-show-tab");
	var show_box = C("#pro-show-box");
	show_tab.child().click(function(){
		show_tab.child().remClass('current');
		C(this).addClass('current');
		show_box.child().hide();
		C(show_box.child().get(this.cIndex)).show()
	}, true);
	// 点击切换详细菜单
	var getCommenntDate = true;
	show_tab.child().click(comm);
	function comm(){
		if(this.cIndex === 1 && getCommenntDate){
			getCommenntDate = false;
			show_tab.child().un("click", comm);
			new Comment(fid);
		}
	}
}();

//模态框
~function(){
	C(".mod-box .close").click(function(){
		C(".mod-box").hide()
	});
	C('.mod-box').click(function(e){
		if(	C.target(e)===this){
			C('.mod-box').hide()
		}
	})
}();


