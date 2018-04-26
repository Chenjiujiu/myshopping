"use strict";
// 单个地址
function Address(data){
	this.data = data;
	this.dom = null;
}
Address.prototype = {
	init:function(){
		this.bindDom();
		this.bindEvent();
	},
	// 初始化绑定
	bindDom:function(){
		var dom = C("<li></li>").addClass("address-item");
		var temp = '<dl><dt class="consignee">#{consignee}</dt><dd class="cellphone">#{cellphone}</dd><dd class="address"><p>#{province}&nbsp;#{city}&nbsp;#{county}&nbsp;</p><p>#{address}</p></dd></dl><div class="ctrl"><a href="#" class="change">修改</a><a href="#" class="delete">删除</a></div>';
		dom.attr("data-cid", this.data.aid);
		dom.bindHtml(temp, this.data);
		this.dom = dom;
	},
	// 绑定地址
	bindaddress:function(){

	},
	bindEvent:function(){
		C(".change", this.dom.get(0)).click(function(e){
			C.prevDef(e);
		});
		C(".delete", this.dom.get(0)).click(function(e){
			C.prevDef(e);

			C(".modal-affirm").show()
		})
	}
};

// 地址盒子
function AddressBox(){
	this.data = null;
	this.baseDom = null;
	this.address = [];
	this.addressDom = null;
	this.init();
	this.nameflag = false;
	this.phoneflag = false;
	this.cityflag = true;
	this.postCodeflag = true;
	this.fixedphoneflag = true;
	this.addressflag = false;
	this.consignee = '';
	this.province = '';
	this.city = '';
	this.county = '';
	this.address = '';
	this.cellphone = '';
	this.fixedphone = null;
	this.postcode = 100000;
	this.is_default = 0;
	this.aid = '';
}
AddressBox.prototype = {
	config:{
		/*输入框*/
		formSection:C(".maddress-body .form-section"),
		/*地址*/
		addressList:C(".content .address .address-list"),

		/*模态框*/
		modaldDom:C(".modal-address"),
		modaldBox:C(".modal-address .maddress-box"),
		modaldInput:C(".modal-address .maddress-body .input-text"),
		modaldInputs:C(".modal-address .input-text"),
		modaldClose:C(".modal-address .close"),
		modaldCancel:C(".modal-address .maddress-ctrl .cancel"),
		modaldOk:C(".maddress-box .maddress-ctrl .ok")
	},
	// 初始化
	init:function(){
		this.bindBaseDom();
		this.bindBaseEvent();
		this.modalBase();
		this.modalTest();
		this.getAddress();
	},
	// 绑定基本dom
	bindBaseDom:function(){
		var temp = '<i class="icon-font">+</i>添加新地址';
		this.baseDom = C("<li></li>")
			.addClass("address-item")
			.addClass("new-address")
			.html(temp);
		this.config.addressList.get(0).innerHTML = "";
		this.config.addressList.get(0).insertBefore(this.baseDom.get(0), this.config.addressList.firstChild().get(0));
	},
	// 绑定基本事件
	bindBaseEvent:function(){
		var that = this;
		this.baseDom.click(function(){
			that.modalShow();
		})
	},
	// 获取地址信息
	getAddress:function(){
		var that = this;
		C.ajax({
			url:"./data/getAddress.php",
			type:"post",
			dataType:'json',
			fn:function(data){
				that.address = data;
				that.bindAddressDom();
			}
		});
	},
	// 创建单个地址dom
	creatAddressDom:function(data){
		this.addressDom = C("<li></li>").addClass("address-item");
		var temp = '<dl><dt class="consignee">#{consignee}</dt><dd class="cellphone">#{cellphone}</dd> <dd class="address"><p><span class="province">#{province}</span>&nbsp;<span class="city">#{city}</span>&nbsp;<span class="county">#{county}</span></p><p class="address-address">#{address}</p></dd> </dl> <div class="ctrl"><a href="#" class="change">修改</a><a href="#" class="delet">删除</a> </div> ';
		this.addressDom.bindHtml(temp, data);
		this.addressDom.attr("data-aid", data.aid);
	},
	//为单个地址绑定事件
	bindAddressEvent:function(){
		var that=this;
		C(".change", this.addressDom.get(0)).click(function(e){
			C.prevDef(e);
			var parent=C(this).parent(".address-item");
			var consignee = C(".consignee",parent.get(0)).html();
			var province = C(".province",parent.get(0)).html();
			var city = C(".city",parent.get(0)).html();
			var county = C(".county",parent.get(0)).html();
			var address = C(".address-address",parent.get(0)).html();
			var cellphone =C(".cellphone",parent.get(0)).html();
			that.aid = parent.attr("data-aid");
			that.consignee=consignee;
			that.province=province;
			that.city=city;
			that.county=county;
			that.address=address;
			that.cellphone=cellphone;

			C('#addconsignee').val(consignee).parent(".form-section").addClass('over');
			C('#addcellphone').val(cellphone).parent(".form-section").addClass('over');
			C('#addcity').val(province+" --> "+city+" --> "+county).parent(".form-section").addClass('over');
			C('#addaddress').val(address).parent(".form-section").addClass('over');
			that.nameflag = true;
			that.phoneflag = true;
			that.cityflag = true;
			that.postCodeflag = true;
			that.fixedphoneflag = true;
			that.addressflag = true;
			that.modalShow();
		});
		C(".delet", this.addressDom.get(0)).click(function(e){
			C.prevDef(e);
			C(".modal-affirm").show();
			var aid = C(this).parent(".address-item").attr("data-aid");
			var that = this;
			C(".modal-affirm  .ctrl-ok").click(function(){
				C.ajax({
					url:'./data/remoAddress.php',
					data:{aid:aid},
					type:'get',
					fn:function(data){
						if(data === "ok"){
							C(that).parent(".address-item").get(0).remove();
							C(".modal-affirm").hide();
						}
					}
				})
			})
		})

	},
	// 循环把地址绑定到页面
	bindAddressDom:function(){
		for(var k in this.address){
			this.creatAddressDom(this.address[k]);
			this.bindAddressEvent();
			this.config.addressList.get(0).insertBefore(this.addressDom.get(0),this.config.addressList.child().get(1));
		}
	},
	//地址模态框基本动画
	modalBase:function(){
		var that = this;
		this.config.modaldInputs.on("focus", function(){
			C(this).parent(".form-section").sibl().remClass('active');
			C(this).parent(".form-section").remClass('over').addClass('active');
		});
		this.config.modaldInputs.on("blur", function(){
			var value = C.trim(this.value);
			C(this).parent(".form-section").remClass('active');
			if(value === ''){
				C(this).parent(".form-section").remClass('over');
			}else{
				C(this).parent(".form-section").addClass('over');
			}
		});
		this.config.modaldClose.click(function(e){
			C.prevDef(e);
			that.modalCance();
		});
		this.config.modaldCancel.click(function(e){
			C.prevDef(e);
			that.modalCance();
		});
		this.config.modaldOk.click(function(e){
			C.prevDef(e);
			if(that.nameflag && that.phoneflag && that.cityflag && that.addressflag && that.postCodeflag && that.fixedphoneflag){
				that.submitAddress({
					consignee:that.consignee,
					province:that.province,
					city:that.city,
					county:that.county,
					address:that.address,
					cellphone:that.cellphone,
					fixedphone:that.fixedphone,
					postcode:that.postcode,
					is_default:that.is_default,
					aid:that.aid
				});
				that.consignee = '';
				that.province = '';
				that.city = '';
				that.county = '';
				that.address = '';
				that.cellphone = '';
				that.fixedphone = null;
				that.postcode = 100000;
				that.is_default = 0;
				that.aid = '';
			}else{
				return false;
			}
		})
	},
	//地址模态框输入检测
	modalTest:function(){
		var nameReg = /^[A-Za-z\u4e00-\u9fa5_]+$/;
		var namePhone = /^0?(1)[3-9][0-9]{9}$/;
		var namecode = /^[0-9]{6}$/;
		var fixedphone = /^[0-9]*$/;
		var that = this;
		var addcity = C("#addcity");
		C("#addconsignee").on("blur", function(){
			var value = C.trim(this.value);
			if(nameReg.test(value) || value === ''){
				that.nameflag = value !== '';
				C(this).parent(".form-section").remClass('error');
				that.consignee = value;
			}else{
				that.nameflag = false;
				C(this).parent(".form-section").addClass('error');
			}
		});
		C("#addcellphone").on("blur", function(){
			var value = C.trim(this.value);
			if(namePhone.test(this.value) || value === ''){
				that.phoneflag = value !== '';
				that.phoneflag = true;
				C(this).parent(".form-section").remClass('error');
				that.cellphone = value;
			}else{
				that.phoneflag = false;
				C(this).parent(".form-section").addClass('error');
			}
		});
		C("#fixedphone").on("blur", function(){
			var value = C.trim(this.value);
			if(fixedphone.test(this.value) || value === ''){
				that.fixedphoneflag = true;
				C(this).parent(".form-section").remClass('error');
				that.fixedphone = value;
			}else{
				that.fixedphoneflag = false;
				C(this).parent(".form-section").addClass('error');
			}
		});
		C("#addpostcode").on("blur", function(){
			var value = C.trim(this.value);
			if(namecode.test(this.value) || value === ''){
				that.postCodeflag = true;
				C(this).parent(".form-section").remClass('error');
				that.postcode = value
			}else{
				that.postCodeflag = false;
				C(this).parent(".form-section").addClass('error');
			}
		});
		C("#addaddress").on("blur", function(){
			var value = C.trim(this.value);
			that.addressflag = value !== '';
			that.address = value;
		});
		C("#addcity").on('focus', function(){
			that.cityflag = false;
			C("#addcity").val(null);
			that.bindcitydom(1);
			C(".city-select").show();
		});
		C("#addcity").on('blur', function(){
			C(this).parent(".form-section").addClass('over')
		});
		C("#cityList").click(function(e){
			var tar = C.target(e);
			if(tar.nodeName === 'LI'){
				var id = C(tar).attr("data-id");
				var type = C(tar).attr("data-type");
				var value = C(tar).html();
				if(type === "1"){
					that.province = value;
					that.bindcitydom(id);
					addcity.val(value);
				}else if(type === "2"){
					that.city = value;
					addcity.val(addcity.val() + ' --> ' + value);
					that.bindcitydom(id);
				}else{
					that.county = value;
					addcity.val(addcity.val() + ' --> ' + value);
					that.cityflag = true;
					C(".city-select").hide();
					C("#cityList").html(" ")
				}
			}
		})
	},
	//城市绑定
	bindcitydom:function(id){
		var temp = '<li data-id="#{id}" data-type="#{type}">#{cityname}</li>';
		C.ajax({
			url:'./data/getCity.php',
			data:{pid:id},
			dataType:"json",
			type:'post',
			fn:function(data){
				C("#cityList").bindHtml(temp, data)
			}
		});


	},
	//地址模态框显示
	modalShow:function(){
		this.config.modaldDom.show();
		this.config.modaldBox
			.animate({targent:{opacity:100}, time:50, avg:true})
	},
	//地址模态框关闭
	modalClose:function(){
		var that = this;
		this.config.modaldBox.animate({
			targent:{opacity:0}, time:50, avg:true, fn:function(){
				that.config.modaldDom.hide();
			}
		})

	},
	//地址模态框取消
	modalCance:function(){
		this.config.modaldInputs.val(null);
		this.config.formSection.remClass("over");
		this.consignee = '';
		this.province = '';
		this.city = '';
		this.county = '';
		this.address = '';
		this.cellphone = '';
		this.fixedphone = null;
		this.postcode = 100000;
		this.is_default = 0;
		this.aid = '';
		C('.modal-address .form-section').remClass('error');
		this.modalClose();
	},
	//地址提交
	submitAddress:function(data){
		var addData=data;
		var that = this;
		C.ajax({
			url:'./data/updataAddress.php',
			data:addData,
			type:'post',
			fn:function(data){
				if(data === "ok"){
					that.creatAddressDom(addData);
					that.bindAddressEvent();
					that.config.addressList.get(0).insertBefore(that.addressDom.get(0),that.config.addressList.child().get(1));
					that.modalCance()
				}
			}
		})
	}
};


// 菜单切换
~function(){
	new AddressBox();
	C(".main .nav a").click(function(e){
		C.prevDef(e);
		var c = C(this).attr("href");
		C(".content .content-box").hide();
		C(".content ." + c).show();
	});
}();

//确认模态框
~function(){
	C(".modal-affirm .affirm-ctrl .ctrl-cancel").click(function(e){
		C.prevDef(e);
		C(".modal-affirm").hide();
	});
	C(".modal-affirm .ctrl-close").click(function(e){
		C.prevDef(e);
		C(".modal-affirm").hide();
	});
	C('.modal-affirm').click(function(e){
		C.prevDef(e);
		if(C.target(e) === this){
			C('.modal-affirm').hide()
		}
	})
}();




