"use strict";
//数据加载
~function(){
	C(".pubHeader").load("./public/shortHeader.html", function(){
		//cookie判断
		~function(){
			var uname = window.C.getCookie("uname");
			uname=decodeURIComponent(uname);
			if(uname !== 'undefined'){
				if(uname !== undefined){
					var str = "";
					var nowH = new Date().getHours();
					if(nowH >= 5 && nowH < 9){
						str = "早上好，<a href='#'>" + uname + "</a>";
					}else if(nowH >= 9 && nowH < 12){
						str = "上午好，<a href='#'>" + uname + "</a>";
					}else if(nowH >= 12 && nowH < 19){
						str = "下午好，<a href='#'>" + uname + "</a>";
					}else if(nowH >= 19 || nowH < 5){
						str = "晚上好，<a href='#'>" + uname + "</a>";
					}
					C("#welcome-uname").html(str);
					C(".topbar-login").hide().next().show();
				}else{
					C(".topbar-login").show().next().hide();
				}
			}else{
				C(".topbar-login").show().next().hide();
			}
		}();
		// 退出
		~function(){
			C("#logout").click(function(){
				C.delCookie({
					"name":"uname",
					"path":"/"
				});
				C.ajax({
					url:'./data/logout.php',
					type:'get',
					fn:function(data){
						location.href = "./pass/login.html"
					}
				});
			});
		}();
		// 屏幕滚动事件
		if(C("#Search_showStite").leng() !== 0){
			~function(){
				// 定点的盒子距离文档顶部位置
				var stiteT = C("#Search_showStite").get(0).offsetTop;
				//搜索盒子距离文档顶部位置
				var searchTop = C(".header-search").get(0).offsetTop;
				//搜索栏dom
				var dom_Search = C("#fixd-search");
				//滚动检测
				C(window).on("scroll", showSearch);
				function showSearch(){
					if(C.scrollTop() <= searchTop + 36){
						dom_Search.animate({targent:{height:0}, time:8, step:5, avg:true});
					}else if(stiteT - C.scrollTop() < C.windowH()){
						dom_Search.animate({targent:{height:70}, time:8, step:5, avg:true});
					}
				}
			}();
		}
		//搜索框效果
		~function(){
			var searIn = C("#header-search-text");
			// 获取搜索栏搜索的关键字 设置给输入框
			var keywords=C.getserch();
			if(keywords.keywords){
				searIn.val(keywords.keywords);
			}
			// 搜索点击事件
			C(".pub-header .hot-words a").click(function(e){
				C.prevDef(e);
				searIn.val(C(this).html());
			});
			C(".pub-header .header-search .input-btn").click(function(e){
				C.prevDef(e);
				var keyword=C.trim(searIn.val());
				keyword=keyword.replace(/\s+/g," ");
				keyword=encodeURIComponent(keyword);
				if(keyword!==''){
					location.href="./search.html?keywords="+keyword;
				}
			});
			searIn.on("keyup",function(e){
				var event=C.event(e);
				this.value = this.value.replace(/[^(0-9a-zA-Z)|(\s)|(\u4e00-\u9fa5)]/g, "");
				var code=event.charCode || event.keyCode;
				if(code===13){
					C(".pub-header .search-box .input-btn").get(0).click();
				}else{
					return false;
				}
			});
		}();
		//购物车效果
		~function(){
			var enterFlag = true;
			var timer = null;
			var temp = '<li class="car-item clearfix"><div class="img"><img src="./images/#{pic}" ></div><div class="des"><a href="#">#{name}</a></div><div class="price"><span>#{price}元</span>x<i>#{num}</i></div></li>';
			var empTemp = '<li class="car-empty">购物车空空如也，赶紧选购吧！</li>';
			var noLogin = '<li class="car-empty">未登录，请先<a href="./pass/login">登录！</a></li>';
			var plaTemp = '<li class="pla"><img src="./images/pla1mall.gif" alt=""></li>';
			C(".pub-topbar .topbar-fun .fun-car").mEnter(function(){
				if(enterFlag){
					enterFlag=false;
					C(".pub-topbar .topbar-fun .car-list").html(plaTemp);
					C(".pub-topbar .fun-car .car-box").show();
					timer = setTimeout(function(){
						getCart()
					}, 500)
				}else{
					return false;
				}
			});
			C(".pub-topbar .topbar-fun .fun-car").mLeave(function(){
				enterFlag=true;
				clearTimeout(timer);
				C(".pub-topbar .fun-car .car-box").hide();
			});
			function getCart(){
				C.ajax({
					type:"post",
					url:'./data/getcart.php',
					dataType:'json',
					fn:callback
				});
				function callback(data){
					var listArr = [];
					var allNums = 0;
					var allPrice = 0;
					if(data===0){
						console.log(data);
						C(".pub-topbar .topbar-fun .car-list").html(noLogin);
						C(".pub-topbar .topbar-fun .car-box .car-sum").hide();
					}else{
						for(var k in data){
							allNums += parseInt(data[k].num);
							allPrice += parseFloat(data[k].price);
							listArr.push(data[k])
						}
						allPrice = C.float2(allPrice);
						if(listArr.length === 0){
							C(".pub-topbar .topbar-fun .car-list").html(empTemp);
							C(".pub-topbar .topbar-fun .car-box .car-sum").hide();
						}else{
							C(".pub-topbar .topbar-fun .car-list").bindHtml(temp, listArr);
							C(".pub-topbar .topbar-fun .car-sum .allNums").html(allNums);
							C(".pub-topbar .topbar-fun .car-sum .allPrice").html(allPrice);
							C(".pub-topbar .topbar-fun .car-box .car-sum").show();
						}
					}

				}
			}
		}()
	});
}();




