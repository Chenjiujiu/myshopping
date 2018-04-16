"use strict";
function Comment(fid){
	this.fid = fid;
	this.pnoNow=1;
	this.init();
}
Comment.prototype = {
	//初始化
	init:function(){
		this.getGrade();
		this.getComment(this.pnoNow);
		this.pnoCtrlEvent();
	},
	// doms
	config:{
		grade_num:C("#grade-num"),//	评分数字
		grade_bar:C(".comment-grade .grade-bar"),//	评分条
		grade_arr:C(".comment-grade .grade-arr"),//	评分箭头
		keywords:C(".comment-grade .keywords"),//	关键词
		com_list:C("#com-list"),	//评论盒子
		pno_ctrlbox:C("#comment-pno"),	//控制按钮盒子
		pno_ctrl_prev:C("#comment-pno .prev"),//上一页
		pno_ctrl_next:C("#comment-pno .next"),	//下一页
		pno_pre:C("#comment-pno .pno-pre"),	//数值上一页
		pno_current:C("#comment-pno .pno-current"),	//当前
		pno_next:C("#comment-pno .pno-next"),	//数值下一页
		pno_more:C("#comment-pno .pno-more")	//更多

	},
	// 数据模版
	temp:{
		keyword:'<span class="tag-item #{type}"><a href="#">#{keyword}(#{num})</a></span>',
		//评价模板
		comment:'<li class="com-item"><div class="content"> <p>#{txt}</p> <div class="img"> <ul class="img-small"></ul> <div class="img-big"><img src="./images/pla1.gif"></div> </div> <i class="time">#{time}</i> <p class="reply"><span>回复：</span>#{reply}</p> </div> <div class="info"> <div class="type"> <p>尺码：<span>#{size}</span></p><p>颜色：<span>#{color}</span></p> </div> <div class="author">#{author}<i class="anonymous">#{tag}</i></div> </div> </li>',
		// 评价图片模板
		comment_img:'<li><img src="./images/#{pic}"></li>'
	},
	//获取评分数据
	getGrade:function(){
		var that = this;
		C.ajax({
			url:'./data/getGrade.php',
			data:{fid:that.fid},
			type:'get',
			dataType:'json',
			fn:function(data){
				that.bindGrade(data);
			}
		})
	},
	//绑定评分
	bindGrade:function(data){
		var num = data.grade;
		this.config.grade_num.html(num / 10);
		this.config.grade_bar.css("width", num * 2 + "%");
		this.config.grade_arr.css("left", num * 2 + "%");
		this.config.keywords.bindHtml(this.temp.keyword, data.keyWords)
	},
	//获取评论数据
	getComment:function(pno){
		var that = this;
		pno=parseInt(pno);
		C.ajax({
			url:'./data/getComment.php',
			data:{fid:that.fid, pno:pno},
			type:'get',
			dataType:'json',
			fn:function(data){
				that.pnoNow=data.page.now;
				that.bindComment(data);
				that.bindPnoCtrl(data.page);
			}
		})
	},
	//绑定评论
	bindComment:function(data){
		var html = '';
		for(var i = 0, len = data.info.length - 1; i < len; i++){
			var obj = data.info[i];
			var item = C.tempStr(this.temp.comment, obj);
			var container = C("<div></div>");
			container.html(item);
			if(obj.reply === null){
				C(".reply", container.get(0)).hide()
			}
			if(obj.pic === null){
				C(".img", container.get(0)).hide()
			}else{
				var imgs = obj.pic.split(',');
				var imgt = C.tempStr(this.temp.comment_img, imgs);
				C(".img-small", container.get(0)).html(imgt)
			}
			html += container.html();
		}
		this.config.com_list.html(html);
		this.bindImgEvent();
	},
	//绑定图片事件
	bindImgEvent:function(){
		C("#com-list .img-small li").click(function(){
			// 边框
			C(this).sibl().remClass("current");
			C(this).addClass("current");
			// 显示
			var src = C(this).child().attr("src");/*==========问题=====*/
			C(this).parent().next().child().attr('src', src).parent().show()
		});
		C("#com-list .img-big img").click(function(){
			C(this).parent().hide();
			C("#com-list .img-small li").remClass("current")
		})
	},
	//绑定页面控制按钮
	bindPnoCtrl:function(page){
		if(page.now == 1){
			this.config.pno_ctrl_prev.addClass("pno-disabl");
			this.config.pno_pre.hide();
		}else{
			this.config.pno_ctrl_prev.remClass("pno-disabl");
			this.config.pno_pre.show();
		}
		if(page.now == page.pageAll){
			this.config.pno_ctrl_next.addClass("pno-disabl");
			this.config.pno_next.hide();
			this.config.pno_more.hide();
		}else{
			this.config.pno_ctrl_next.remClass("pno-disabl");
			this.config.pno_next.show();
			this.config.pno_more.show();
		}
		this.config.pno_pre.html(parseInt(page.now) - 1);
		this.config.pno_current.html(parseInt(page.now));
		this.config.pno_next.html(parseInt(page.now) + 1);

	},
	//页面控制按钮事件
	pnoCtrlEvent:function(){
		var flag = true;
		var that=this;
		this.config.pno_ctrlbox.child().child().click(function(e){
			if(C(this).hasClass("prev")&&!C(this).hasClass("pno-disabl")){
				that.getComment(parseInt(that.pnoNow)-1);
			}else if(C(this).hasClass("next")&&!C(this).hasClass("pno-disabl")){
				that.getComment(parseInt(that.pnoNow)+1);
			}else if(C(this).hasClass("pno-item")&&!C(this).hasClass("pno-disabl")){
				console.log(this.innerHTML);
			}else{
					return 	;
			}
		})
	}
};