"use strict";
// 产品对象
function Product(data) {
  // 品牌
  this.name=data.name;
  // 价格
  this.price=data.price;
  //图片
  this.img=data.img;
  //链接地址
  this.href=data.href;
  //活动
  this.new=data.new;
  this.sale=data.sale;
}
Product.prototype={

};