// 轮播图对象
function Slider(data,select) {
  //数据
  this.data = data;
  //dom元素
  this.config = {
    //轮播项盒子
    slideBox: C(select+" .slider-list"),
    //下一个按钮
    btnNext: C(select+" .ctrl-next"),
    //上一个按钮
    btnPrev: C(select+" .ctrl-prev"),
    //小圆点盒子
    dots: C(select+" .dots")
  };
  //轮播模板
  this.itemTemp = '<li class="slider-item"><a href="#{href}"><img src="./images/#{img}" alt=""></a></li>';
  //小圆点模板
  this.dotsTemp = '<li>#{i}</li>';
  //当前张数
  this.index = 0;
  //定时器开关
  this.timer;
}
Slider.prototype = {
	// 初始化
  init: function () {
    this.bindItem();
    this.creatDots();
    this.bindCtrl();
    this.bindDots();
    this.autoPlay(true);
    this.showCurrent();
  },
  //绑定轮播项
  bindItem: function () {
    this.config.slideBox.bindHtml(this.itemTemp,this.data)
  },
  //生成小圆点
  creatDots: function () {
    var that = this;
    var str = '';
    for (var i = 0; i < this.data.length; i++) {
      str +=that.dotsTemp.replace(/#\{(\w+)\}/g,i);
    }
    this.config.dots.html(str)
  },
  //绑定按钮事件
  bindCtrl: function () {
    var that = this;
    this.config.btnNext.click(function () {
      that.autoPlay(false);
      that.index++;
      if (that.index >= that.config.slideBox.child().leng()) {
        that.index = 0;
      }
      that.showCurrent();
      that.autoPlay(true);
    });
    this.config.btnPrev.click(function () {
      that.autoPlay(false);
      that.index--;
      if (that.index < 0) {
        that.index = that.config.slideBox.child().leng() - 1;
      }
      that.showCurrent();
      that.autoPlay(true);
    });

  },
  //绑定小圆点事件
  bindDots: function () {
    var that=this;
		this.config.dots.child().click(function () {
      that.autoPlay(false);
      that.index=C(this).html();
      that.showCurrent();
      that.autoPlay(true);
    })
  },
  //自动播放和暂停
  autoPlay: function (flag) {
    var that = this;
    if (flag) {
      this.timer = setInterval(function () {
        that.config.btnNext.get(0).click();
      }, 3000);
    } else {
      clearInterval(that.timer);
    }
  },
  //当前显示
  showCurrent: function () {
    this.config.slideBox.child().remClass("current");
    C(this.config.slideBox.child().get(this.index)).addClass("current");
		this.config.dots.child().remClass("current");
    C(this.config.dots.child().get(this.index)).addClass("current");
  }
};
