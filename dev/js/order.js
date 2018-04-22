"use strict";
~function(){
	//单个产品模版
	var proTemp='<ul class="order-item clearfix"><li class="img"><img src="./images/#{pic}"></li><li class="desc">#{name}</li><li class="info"><span class="info-color">颜色：<em>#{color}</em></span><span class="info-size">尺码：<em>#{size}</em></span></li><li class="price">#{price}</li><li class="num">#{num}</li><li class="sale">省#{sale}</li><li class="minsum">#{sum}</li></li></ul>';
	//收货地址模版
	var addTemp='<li class="address-item" data-aid="#{aid}"><div><p class="detail"><span>#{procince}&nbsp;#{city}&nbsp;#{county}</span></p> <p class="address">#{address}</p> <p class="consignee">(<span>#{consignee}&nbsp;收</span>)<span class="uiphone">#{cellphone}</span> </p> <p class="default#{is_default}"><span>默认地址</span></p></div></li>';
	//确认收货地址模版
	var infoaddTemp='<span class="to">配送至：</span>#{procince}&nbsp;#{city}&nbsp;#{county}&nbsp;#{address}';
	//确认收货人模版
	var infoconTemp='收货人：<span class="consignee">#{consignee}</span><span class="uphone">#{cellphone}</span>';
	//获取订单信息
	C.ajax({
		url:'./data/confirmorder.php',
		type:'post',
		dataType:"json",
		fn:function(data){
			if(data.type==="0"){
				C("#mod-box .title").html(data.msg);
				C("#mod-box").show();
			}else{
				C(".order-box .order-list").bindHtml(proTemp,data.order);
				C(".order-info .allPrice").html(data.sumPrice);
			}
		}
	});
	//获取地址信息
	C.ajax({
		url:'./data/getAddress.php',
		type:'post',
		dataType:"json",
		fn:function(data){
			var html='';
			for(var k in data){
				html+=C.tempStr(addTemp,data[k]);
			}
			C("#address-list").html(html);
			C("#address-box .address-item").click(function(){
				C("#address-box .address-item").remClass("current");
				C(this).addClass("current");
				// 获取对应的aid 并设置给父级
				var aid=C(this).attr("data-aid");
				C("#address-list").attr("data-current",aid);
				//修改下面的订单信息
				C(".order-info .info-address").bindHtml(infoaddTemp,data[aid])
				C(".order-info .info-consignee").bindHtml(infoconTemp,data[aid])
			});
			C("#address-box .address-item").get(0).click();
			C("#order-submit").click(function(){
				var aid=C("#address-list").attr("data-current");
				C.ajax({
					url:'./data/submitorder.php',
					type:'post',
					data:{
						aid:aid
					},
					fn:function(data){
						if(data){
							C("#mod-box .title").html(data);
							C("#mod-box").show();
						}else{
							location.href='./play.html'
						}
					}
				})
			})


		}
	});
}();

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
