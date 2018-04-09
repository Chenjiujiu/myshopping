"use strict";
// 轮播图
~function () {
  C.ajax({
    url:"./data/index_slider.php",
    type:"get",
    data:"",
    dataType:"json",
    fn:callback
  });
  function callback(data) {
    var slider=new Slider(data);
  }

}();
//品牌图片
/*~function(){
	var data=['阿迪达斯','耐克','李宁','特步','新百伦','361度','PONY','匹克','乔丹','鸿星尔克','乐途','锐步','匡威','美津浓','亚瑟士','万斯','彪马','安踏','公鸡','斐乐','斯凯奇','七品芝麻','百丽','达芙妮','千百度','他她','舒丹妮','迪斯尼','星期六','无印良品','Clarks','奥康','红蜻蜓','康奈','森达','百丽','金猴','蜘蛛王','富贵鸟','七品芝麻','美犀','老人头','圣大保罗','斯凯奇','卡帝乐','骆驼','朗蒂维','木林森','接吻猫','Ecco','茵曼','JC','华伦天奴','卓诗尼','哈森','珂卡芙','一代佳人','意尔康','蔻驰','大黄蜂','伊布朵朵','UOVO','史卢比','宾龙','哈比熊','七波辉','巴布豆','巴拉巴拉','ABC','南极人','宝人','哈瓦那','耀利','恒仁','伊帕内玛','回力','快鹿','ROXY','路路佳','宾龙','班尼路'];
	var item=C(".brand .brand-item").get();
	for(var i = 0 ,len=data.length; i < len;i++){
		var newli=document.createElement('li');
		var newa=document.createElement('a');
		var newli1=document.createElement('span');
		var newli2=document.createElement('span');
		C(item[i]).child().child(".brand-pic").css("backgroundPosition","0 "+-i*45+"px")
			.parent().child(".brand-name").html(data[i]);

	}
}();*/

