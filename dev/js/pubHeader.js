"use strict";
//数据加载
~function(){
	C(".pubHeader").load("./public/pubHeader.html", function(){
		//cookie判断
		~function(){
			var uid = window.C.getCookie("uid");
			if(uid !== undefined){
				var callback = function(data){
					if(data !== undefined){
						var str = "";
						var nowH = new Date().getHours();
						if(nowH >= 5 && nowH < 9){
							str = "早上好，<a href='#'>" + data + "</a>";
						}else if(nowH >= 9 && nowH < 12){
							str = "上午好，<a href='#'>" + data + "</a>";
						}else if(nowH >= 12 && nowH < 19){
							str = "下午好，<a href='#'>" + data + "</a>";
						}else if(nowH >= 19 || nowH < 5){
							str = "晚上好，<a href='#'>" + data + "</a>";
						}
						C("#welcome-uname").html(str);
						C(".topbar-login").hide().next().show();
					}else{
						C(".topbar-login").show().next().hide();
					}
				};
				C.ajax({
					type:'post',
					url:'./data/islogin.php',
					data:{
						"uid":uid
					},
					fn:callback
				});
			}else{
				C(".topbar-login").show().next().hide();
			}
		}();
		// 退出
		~function(){
			C("#logout").click(function(){
				C.delCookie({
					"name":"uid",
					"path":"/"
				});
				location.href = "./pass/login.html"
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
			var searIn=C("#header-search-text");
			C(".pub-header .hot-words a").click(function(e){
				C.prevDef(e);
				searIn.val(C(this).html());
			});
			C(".pub-header .search-box .input-btn").click(function(e){
				C.prevDef(e);
				var keyword=C.trim(searIn.val());
				if(keyword!==''){
					location.href="./search.html?keywords="+keyword;
				}
			})
		}();
	});
}();




