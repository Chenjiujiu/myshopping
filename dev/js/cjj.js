/**
 * @描述: cjj
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */
~function(window){
	// 实例化对象,并返回
	window.C = function(ele, parent, flag){//选择器，上下文，h5选择器开关
		return new Cjj(ele, parent, flag);
	};
	var Cjj = function(ele, parent, flag){
		this.doms = [];
		flag = flag || false;//默认不开启h5选择器
		return this.init(ele, parent, flag);
	};
	C.extend = Cjj.prototype.extend = function(){
		var option, name, src, copy,
			target = arguments[0] || {},
			index = 1,
			length = arguments.length;
		if(index === length){	//一个参数 则拷贝给Cjj
			target = this;
			index--;
		}
		for(; index < length; index++){
			if((option = arguments[index]) != null){
				for(name in option){
					copy = option[name];
					target[name] = copy;
				}
			}
		}
		return target;
	};
	Cjj.prototype = C.extend({
		init:function(ele, parent, flag){
			if(this.isDom(ele) || this.isObj(ele)){
				//是对象直接push到doms
				this.doms.push(ele);
				return this;
			}else if(this.isStr(ele) && ele.charAt(0) === "<"){
				//是<开头则是标签，先创建在push到doms
				var tag = ele.slice(1, ele.indexOf(">"));
				var content = ele.slice(ele.indexOf(">") + 1, ele.lastIndexOf("<"));
				var newdom = document.createElement(tag);
				newdom.innerHTML = content;
				this.doms.push(newdom);
				return this;
			}else if(this.isStr(ele)){
				//不是标签 是字符串则是选择器
				return this.select(ele, parent);
			}else{
				//为空 或者null，undifine 时候直接返回Cjj
				return this;
			}
		},
		//去除空格
		trim:function(str, where){
			if(where === undefined){
				return str.replace(/(^\s*)|(\s*$)/g, '');
			}else if(where === 'l'){
				return str.replace(/(^\s*)/g, '');
			}else if(where === 'r'){
				return str.replace(/(\s*$)/g, '');
			}
		},
		//随机数
		random:function(star, end){
			return Math.floor(Math.random() * (end - star)) + star;
		},
		//ajax
		ajax:function(arg){//{type,url,data,dataType,fn,callback}
			var datas = '';
			for(var k in arg.data){
				datas += "&&" + k + "=" + arg.data[k];
			}
			datas = datas.slice(2);
			if(arg.dataType === 'jsonp'){
				var newscript = document.createElement('script');
				newscript.src = arg.url + "?" + datas + "&&callback=" + arg.callback;
				document.appendChild(newscript);
			}else{
				var xhr = null;
				var url = arg.url;
				var param = null;
				if(window.XMLHttpRequest){
					xhr = new XMLHttpRequest();
				}else{
					xhr = new ActiveXObject("Microsoft.XMLHTTP")
				}
				if(arg.type === "get"){
					url = arg.url + "?" + datas;
				}else{
					param = datas;
				}
				xhr.open(arg.type, url, true);
				if(arg.type === "post"){
					xhr.setRequestHeader('content-Type', 'application/X-www-form-urlencoded')
				}
				xhr.onreadystatechange = function(){
					if(xhr.readyState === 4 && xhr.status === 200){
						if(arg.dataType === "json"){
							arg.fn(JSON.parse(xhr.responseText));
						}else{
							arg.fn(xhr.responseText);
						}
					}
				};
				xhr.send(param);
			}
		},
		//load
		load:function(url, fn){
			var that = this;
			this.ajax({
				type:"post",
				url:url,
				fn:function(data){
					that.html(data);
					if(fn){
						fn();
					}
				}
			})
		},
		//获取url参数
		getserch:function(arg){
			// ?uid=1&uname=xiaomin&&upwd=123;
			var result = {};
			var search = location.search.slice(1);
			search = decodeURIComponent(search);
			if(arg === undefined){
				search = search.replace(/\s*\&+\s*/g, '&');
				var data = search.split("&");
				for(var i = 0; i < data.length; i++){
					var item = data[i].split("=");
					if(item[1] !== undefined){
						result[item[0]] = item[1];
					}
				}
			}else{
				search = '&' + search + '&';
				var star = search.indexOf("=", search.indexOf(arg));
				var end = search.indexOf("&", search.indexOf(arg));
				result = this.trim(search.slice(star + 1, end));
			}
			return result;
		},
		//拷贝对象
		copy:function(targ){
			return C.extend({}, targ)
		}
	});
	//数据类型判断
	C.extend({
		type:function(obj){
			return Object.prototype.toString.call(obj);
		},
		isnum:function(val){
			return this.type(val) === "[object Number]";
		},
		isBool:function(val){
			return this.type(val) === "[object Boolean]";
		},
		isStr:function(val){
			return this.type(val) === "[object String]";
		},
		isUn:function(val){
			return this.type(val) === "[object Undefined]";
		},
		isNull:function(val){
			return this.type(val) === "[object Null]";
		},
		isObj:function(){
			var val = arguments[0];
			var flag = arguments[1] || false;
			if(flag){
				return this.type(val) === "[object Object]";
			}else{
				if(val === null || typeof val === 'undefined'){
					return false;
				}
				return typeof val === 'object';
			}
		},
		isArray:function(val){
			return this.type(val) === "[object Array]";
		},
		isDom:function(obj){
			if(typeof HTMLElement === "object"){
				return obj instanceof HTMLElement;
			}else{
				return obj && typeof obj === 'object' && obj.nodeType === 1;
			}

		},
		float2:function(obj){
			var obj=parseFloat(obj);
			obj=Math.ceil(obj*100)/100;
			var objarr=obj.toString().split(".");
			if(objarr.length===1){
				obj=obj.toString()+".00";
				return obj;
			}
			if(objarr.length>1){
				if(objarr[1].length<2){
					obj=obj.toString()+"0";
				}
				return obj
			}
		}
	});
	//选择框架
	Cjj.prototype.extend({
		//选择器
		select:function(ele, parent, flag){
			parent = parent || document;
			//id选择器
			var that = this;
			function id(ele){
				var dom = document.getElementById(ele);
				if(dom !== null){
					pushDoms([dom]);
				}
				return this;
			}
			// tag选择器
			function tag(ele, context){
				context = context || document;
				var dom = context.getElementsByTagName(ele);
				if(dom !== null){
					pushDoms(dom);
				}
				return this;
			}
			//class选择器
			function cla(ele, context){
				context = context || document;
				ele = that.trim(ele);
				if(context.getElementsByClassName){
					var doms = context.getElementsByClassName(ele);
					if(doms !== null){
						pushDoms(doms);
					}
					return this;
				}else{
					var tags = context.getElementsByTagName('*');
					var len = tags.length;
					for(var i = 0; i < len; i++){
						var cls = tags[i].className.split(' ');
						for(var j = 0; j < cls.length; j++){
							if(cls[j] === ele){
								pushDoms([tags[i]]);
							}
						}

					}
				}
				return this;
			}
			//h5选择器
			function all(ele, context){
				context = context || document;
				var dom = context.querySelectorAll(ele);
				if(dom !== null){
					pushDoms(dom);
				}
				return this
			}
			//追加到doms
			function pushDoms(d){
				for(var j = 0, dlen = d.length; j < dlen; j++){
					for(var k = 0; k < that.doms.length; k++){	//遍历当前doms
						if(that.doms[k] === d[j]){//如果已经存在一个目标一样，
							that.doms[k] = d[j];	//替换doms里面已有的，
							d[j] = null;	//同时d[j]清空，
							return;
						}
					}
					that.doms.push(d[j]);
				}
			}
			var eles = this.trim(ele).split(' ');//ele转换为数组
			var context = [];	//保存上下文(父级doms)
			if(eles.length === 1 && this.trim(eles[0]).slice(0, 1) === "#"){
				id(this.trim(eles[0]).slice(1))
			}else{
				if(document.querySelectorAll && flag){	//支持h5并且开启了h5
					all(ele, parent)
				}else{	//不支持或者关闭
					for(var i = 0, len = eles.length; i < len; i++){
						this.doms = [];
						var item = this.trim(eles[i]);	//每个选择器去左右空格
						var first = item.slice(0, 1);	//标示符
						var sel = item.slice(1);	//标	签
						if(first === '#'){	//id
							id(sel);
							context = this.doms;
						}else if(first === '.'){//类

							if(context.length){
								for(var j = 0, conlen = context.length; j < conlen; j++){
									cla(sel, context[j]);
								}
							}else{
								cla(sel, parent);
							}
							context = this.doms;
						}else{//标签
							if(context.length){
								for(var k = 0, conlen = context.length; k < conlen; k++){
									tag(item, context[k]);
								}
							}else{
								tag(item, parent);
							}
							context = this.doms;
						}
					}
				}
			}
			return this;
		},
		parent:function(sel){
			var newdom = new Cjj();
			newdom.doms = Array.prototype.slice.call(this.doms);
			var domsparent = [];
			for(var i = 0; i < newdom.doms.length; i++){
				var obj = newdom.doms[i];
				if(sel){
					sel = this.trim(sel);
					var first = sel.charAt(0);
					var content = sel.slice(1);
					if(first === "#"){	//id的话直接搜索id
						domsparent.push(document.getElementById(content));
					}
					else if(first === "."){
						do{
							var objP = obj.parentNode; //obj的父元素
							var flag = -1 < (" " + objP.className + " ").indexOf(" " + content + " ");
							if(flag){
								domsparent.push(objP);
								newdom.doms = domsparent;
								return newdom;
							}
							obj = objP;
						}while(objP.nodeName !== "HTML");
					}
					else{//不是# 也不是. 则查找标签
						do{
							var objP = obj.parentNode; //obj的父元素
							if(objP.nodeName === sel.toUpperCase()){
								domsparent.push(objP);
								newdom.doms = domsparent;
								return newdom;
							}
							obj = objP;
						}while(objP.nodeName !== "HTML");
					}
				}else{	//没参数就直接返回父元素
					domsparent.push(obj.parentNode);
				}
			}
			newdom.doms = domsparent;
			return newdom;
		},
		child:function(sel){
			var newdom = new Cjj();
			newdom.doms = Array.prototype.slice.call(this.doms);
			var domschild = [];
			for(var i = 0; i < newdom.doms.length; i++){
				var obj = newdom.doms[i];
				var child = obj.children;
				if(sel){
					sel = this.trim(sel);
					var first = sel.charAt(0);
					var content = sel.slice(1);
					if(first === "#"){	//id的话直接搜索id
						domschild.push(document.getElementById(content));
					}
					else if(first === "."){
						for(var j = 0; j < child.length; j++){
							var obj1 = child[j];
							var flag = -1 < (" " + obj1.className + " ").indexOf(" " + content + " ");
							if(flag){
								domschild.push(obj1);
							}
						}
					}
					else{//不是# 也不是. 则查找标签
						for(var j = 0; j < child.length; j++){
							var obj2 = child[j];
							if(obj2.nodeName === sel.toUpperCase()){
								domschild.push(obj2);
							}
						}
					}
				}else{	//没参数就直接返回子元素
					domschild = obj.children;
				}
			}
			newdom.doms = domschild;
			return newdom;
		},
		firstChild:function(){
			var newdom = new Cjj();
			newdom.doms = Array.prototype.slice.call(this.doms);
			var domschild = [];
			for(var i = 0; i < this.doms.length; i++){
				var obj = newdom.doms[i];
				var child = obj.firstElementChild || obj.firstChild;
				domschild.push(child);
			}
			newdom.doms = domschild;
			return newdom
		},
		lastChild:function(){
			var newdom = new Cjj();
			newdom.doms = Array.prototype.slice.call(this.doms);
			var domschild = [];
			for(var i = 0; i < newdom.doms.length; i++){
				var obj = newdom.doms[i];
				var child = obj.lastElementChild || obj.lastChild;
				domschild.push(child);
			}
			newdom.doms = domschild;
			return newdom
		},
		next:function(){
			var newdom = new Cjj();
			newdom.doms = Array.prototype.slice.call(this.doms);
			var domsnext = [];
			for(var i = 0; i < newdom.doms.length; i++){
				var obj = newdom.doms[i];
				do{
					var next = obj.nextElementSibling || obj.nextSibling;
					obj = next;
				}while(next.nodeType !== 1);
				domsnext.push(next);
			}
			newdom.doms = domsnext;
			return newdom;
		},
		prev:function(){
			var newdom = new Cjj();
			newdom.doms = Array.prototype.slice.call(this.doms);
			var domsprev = [];
			for(var i = 0; i < newdom.doms.length; i++){
				var obj = newdom.doms[i];
				var prev = obj.previousElementSibling || obj.previousSibling;
				domsprev.push(prev);
			}
			newdom.doms = domsprev;
			return newdom;
		},
		sibl:function(sel){
			return this.parent().child(sel);
		},
		//转换dom元素
		get:function(i){
			if(i === undefined){
				return this.doms;
			}else{
				return this.doms[i];
			}
		},
		//计算doms长度
		leng:function(){
			return this.doms.length;
		}
	});
	//css属性框架
	Cjj.prototype.extend({
		//设置样式,属性,文本
		css:function(k, v){
			if(v){
				if(k === "opacity"){
					for(var i = 0; i < this.doms.length; i++){
						var obj = this.doms[i];
						obj.style[k] = v;
						obj.style.filter = "alpha(opacity=" + v * 100 + ")";
					}
				}else{
					for(var i = 0; i < this.doms.length; i++){
						var obj = this.doms[i];
						obj.style[k]=v;
					}
				}
				return this;
			}else{//	如果没有v 则表示获取
				var dom = this.get(0);
				if(window.getComputedStyle){
					return getComputedStyle(dom, null)[k];
				}else{
					return dom.currentStyle[k];
				}
			}
		},
		attr:function(k, v){
			if(v){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.setAttribute(k, v);
				}
			}else{
				return this.doms[0].getAttribute(k);
			}
			return this;
		},
		html:function(h){
			if(h !== undefined){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.innerHTML = h;
				}
				return this;
			}else{
				return this.get(0).innerHTML;
			}
		},
		txt:function(h){
			if(h !== undefined){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
						obj.innerHTML = h;
				}
				return this;
			}else{
					return this.get(0).innerText|| this.get(0).textContent;
			}
		},
		val:function(v){
			if(v){
				this.get(0).value = v;
			}else{
				return this.get(0).value;
			}
		},
		//添加,移除,判断class
		setClass:function(c){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj.className = c;
			}
			return this;
		},
		addClass:function(c){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				if(!C(obj).hasClass(c)){
					obj.className = obj.className + " " + c;
				}
			}
			return this;
		},
		remClass:function(c){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj.className = this.trim((" " + obj.className + " ").replace(" " + c + " ", " "));
			}
			return this;
		},
		hasClass:function(c){
			var flag = false;
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				flag = -1 < (" " + obj.className + " ").indexOf(" " + c + " ");
			}
			return flag;
		},
		//显示隐藏元素
		show:function(){
			this.css('display', 'block');
			return this;
		},
		hide:function(){
			this.css('display', 'none');
			return this;
		},
		toggle:function(){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				if(obj.style.display === 'none'){
					obj.style.display = 'block';
				}else{
					obj.style.display = 'none';
				}
			}
			return this
		},
		testCss:function(prop){
			var div = document.createElement('div'),
				vendors = 'Ms O Moz Webkit'.split(' '),
				len = vendors.length;
			if(prop in div.style){
				return true;
			}
			prop = prop.replace(/^[a-z]/, function(val){
				return val.toUpperCase();
			});
			while(len--){
				if(vendors[len] + prop in div.style){
					return true;
				}
			}
			return false;
		}
	});
	//文档框架
	C.extend({
		/*offsetWidth/Height/Left/Top/Parent/返回对象自己的宽高(width+boder+padding),距离上一级定位盒子的左上的位置，返回父级定位盒子。
		window.scrreen.width/height/X/Y/返回屏幕的宽高，距离左上的位置。
		clientWidth/Height/X/Y/返回当前可视区域的宽高，以及光标位于可视区左上的位置。
		pageX/Y,光标相对网页的水平垂直位置 （IE8没有）
		scroll 滚动的
		*/
		windowH:function(){
			var h;
			if(window.innerHeight){
				h=window.innerHeight;
			}else{
				h=document.documentElement.clientHeight;
			}
			return h
		},
		windowW:function(){
			var w;
			if(window.innerWidth){
				w=window.innerWidth;
			}else{
				w=document.documentElement.clientWidth;
			}
			return w
		},
		scrollTop:function(){
			return window.pageYOffset || /*ie9+以及最新浏览器*/
				document.documentElement.scrollTop || /*火狐和其他有DTD的正常浏览器*/
				document.body.scrollTop || /*谷歌和没有申明DTD的浏览器*/
				0;
		},
		scrollLeft:function(){
			return window.pageYOffset || /*ie9+以及最新浏览器*/
				document.documentElement.scrollTop || /*火狐和其他有DTD的正常浏览器*/
				document.body.scrollTop || /*谷歌和没有申明DTD的浏览器*/
				0;
		},
		//获取用户选择的文本
		getSelectText:function(){
			return window.getSelection ?
				window.getSelection().toString() :	//标准浏览器
				document.selection.createRange().text;	//IE
		}
	});
	//动画框架
	Cjj.prototype.extend({
		animate:function(data){//{targent:{},time10,step:10,avg:false,fn:fun}
			// attr{width:21px,height20px},透明度用0-100
			// time:定时器时间间隔 默认10,
			// step:步长比 默认10,
			// avg:匀速运动。默认false 缓动，
			// fn：回调函数
			var that = this,
				obj = this.get(0),
				current = [],	//用来保存属性当前值
				targent = [];//目标值需要被保存起来，方便暂停目标值
			var step = data.step || 10;	//步长或者每次走的比例1/10
			data.time = data.time || 10;	//定时器时间
			data.avg = data.avg || false;	//是否匀速播放
			data.infi = data.infi || false;	//是否循环
			//初始化当前值
			for(var attr in data.targent){	//读取当前属性值保存；
				if(attr === "opacity"){
					current[attr] = parseInt(this.css(attr) * 100) || 0;
				}else{
					current[attr] = parseInt(this.css(attr));//去掉单位
				}
				data.targent[attr] = parseFloat(data.targent[attr]);//转化为数字
			}
			//初始化目标值，
			targent = C.copy(data.targent);

			//保存动画参数，方便再次开启
			obj.animateData = C.copy(data);
			clearInterval(obj.timer);
			obj.timer = setInterval(function(){
				var flag = true; 	//定时器开关
				for(var attr in data.targent){
					if(data.avg){
						step = targent[attr] >= current[attr] ? Math.abs(step) : -Math.abs(step);
						current[attr] = current[attr] + step;
						if(Math.abs(targent[attr] - current[attr]) <= Math.abs(step)){
							current[attr] = targent[attr];
						}
					}else{
						current[attr] = current[attr] + (targent[attr] - current[attr]) / step;
						if(Math.abs(targent[attr] - current[attr]) < 2){
							current[attr] = targent[attr];
						}
					}
					if(attr === "opacity"){
						that.css(attr, current[attr] / 100);
					}else if(attr === "zIndex"){
						that.css(attr, current[attr]);
					}else{
						that.css(attr, current[attr] + 'px');
					}
					if(current[attr] !== targent[attr]){//只要有一个属性还没达到，则不关闭定时器
						flag = false;
					}
				}
				if(flag){
					clearInterval(obj.timer);
					if(data.fn){	//	如果有回调函数则执行回调函数
						data.fn();
						return this;
					}
					if(data.infi){	//如果有循环
						var data2 = C.copy(data);
						var gd = data2.targent;
						data2.targent = data2.start;
						data2.start = gd;
						that.animate(data2)
					}
				}
			}, data.time);
			return this;
		},
		stop:function(flag){
			if(flag){	//flag =true时候 动画立即执行完毕；
				var data = {};
				data = C.extend(data, this.get(0).animateData);//拷贝一个动画数据
				data.avg = false;	//修改为缓动
				data.step = 1;	//一步到位
				data.infi = false;//关闭循环
				this.animate(data);	//开启
			}else{	//否则动画直接清除。参数依旧保存在dom对象中，可以再次开启
				clearInterval(this.get(0).timer)
			}
			return this;
		},
		start:function(){
			//取出数据在其开启动画；
			if(this.get(0).animateData){
				this.animate(this.get(0).animateData);
			}
			return this;
		}
	});
	//事件框架
	Cjj.prototype.extend({
		//事件绑定
		on:function(type, fn, flag){
			flag = flag === undefined ? false : flag;
			// 正常浏览器
			if(document.addEventListener){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.cIndex = i;
					obj.addEventListener(type, fn, flag);
				}
			}else if(document.attachEvent){	//ie
				for(var j = 0; j < this.doms.length; j++){
					var obj2 = this.doms[j];
					obj2.cIndex = j;
					obj2.attachEvent('on' + type, function(obj2){
						return function(){
							fn.call(obj2);
						}
					}(obj2));
				}
			}
			return this;
		},
		un:function(type, fn){
			if(document.removeEventListener){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.removeEventListener(type, fn);
				}
			}else if(document.detachEvent){	//ie
				for(var j = 0; j < this.doms.length; j++){
					var obj2 = this.doms[j];
					obj2.detachEvent(type, fn);
				}
			}
			return this;
		},
		click:function(fn, flag){
			this.on('click', fn, flag);
			return this;
		},
		one:function(fn){
			this.get(0).onclick=function(){
				fn()
			}
		},
		mEnter:function(fn, flag){
			this.on('mouseenter', fn, flag);
			return this;
		},
		mLeave:function(fn, flag){
			this.on('mouseleave', fn, flag);
			return this;
		},
		hover:function(overfn, outfn, flag){
			if(overfn){
				this.on('mouseover', overfn, flag);
			}
			if(outfn){
				this.on('mouseout', outfn, flag)
			}
			return this;
		},
		//表单修改
		change:function(fn,flag){
				this.on('input',fn, flag);
				this.on('propertychange',fn, flag);
		},
		// 拖拽
		drag:function(data){//box,x,y
			var container = data.box || document;
			var openx = data.x === undefined ? true : data.x;
			var openy = data.y === undefined ? true : data.y;
			var over = data.over;
			this.on("mousedown", function(ev){
				C.prevDef(ev);
				var starX = C.event(ev).clientX - this.offsetLeft;//点击时候 光标相对ul 的我位置
				var starY = C.event(ev).clientY - this.offsetTop;//点击时候 光标相对ul 的我位置
				var that = this;
				container.onmousemove = function(ev){
					C.prevDef(ev);
					if(openx){
						var targX = (C.event(ev).clientX - starX) + "px";
						if(over){
							targX = parseInt(targX) > 0 ? 0 : targX;
							targX = parseInt(targX) < (C(that).parent().get(0).offsetWidth - that.offsetWidth) ?
								(C(that).parent().get(0).offsetWidth - that.offsetWidth) + "px" : targX;
						}
						C(that).css("left", targX);
					}
					if(openy){
						var targY = (C.event(ev).clientY - starY) + "px";
						if(over){
							targY = parseInt(targY) > 0 ? 0 : targY;
							targY = parseInt(targY) < (C(that).parent().get(0).offsetHeight - that.offsetHeight) ?
								(C(that).parent().get(0).offsetHeight - that.offsetHeight) + "px" : targY;
						}
						C(that).css("top", targY);
					}
				};
				container.onmouseup = function(ev){
					container.onmousemove = null;
					container.onmouseup = null;
				}
			});
			return this;
		}
	});
	C.extend({
		//事件对象
		event:function(event){
			return event ? event : window.event;
		},
		//事件目标
		target:function(event){
			var e = this.event(event);
			return e.target || e.srcElement;
		},
		//阻止默认行为
		prevDef:function(event){
			var e = this.event(event);
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue = false;
			}
			return this;
		},
		//阻止冒泡
		stopProp:function(event){
			var e = this.event(event);
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble = true;
			}
			return this;
		}
	});
	//cookie框架
	C.extend({
		//cookie
		setCookie:function(data){	//{name,value,days,path}
			var cookieText = "";
			cookieText += encodeURIComponent(data.name) + "=" + encodeURIComponent(data.value);
			if(data.days){
				var expires = new Date();
				expires.setTime(expires.getTime() + data.days * 24 * 60 * 60 * 1000);
				cookieText += ";expires=" + expires.toUTCString();
			}
			if(data.path){
				cookieText += "; path=" + data.path;
			}
			if(data.domain){
				cookieText += "; domain=" + data.domain;
			}
			if(data.secure){
				cookieText += "; data.secure";
			}
			document.cookie = cookieText;
			return this;
		},
		getCookie:function(d){
			var data = encodeURIComponent(d);
			var allCookies = document.cookie;
			data += "=";
			//添加= 再找data所在的位置
			var result = allCookies.indexOf(data);
			if(result !== -1){
				//存在则从=+名字长度的位置开使找到下一个;
				var start = result + data.length;
				var end = allCookies.indexOf(";", start);
				if(end === -1){
					// 没有下一个；则找到末尾
					end = allCookies.length;
				}
				var value = allCookies.substring(start, end);
				return decodeURIComponent(value);
			}else{
				// 没找到则返回undefined
				return undefined;
			}
		},
		delCookie:function(data){
			this.setCookie({
				"name":data.name,
				"path":data.path || "/",
				"days":-10,
				"value":""
			});
			return this;
		}
	});
	//数据绑定框架
	C.extend({
		//模版字符串
		tempStr:function(str, data){
			//hahahahhaha#{name}fwhfawh	 用data里面的数据来替代#{name}
			if(this.isObj(data,true)||data.length===0){
				return str.replace(/#\{(\w+)\}/g, function(m, key){
					return typeof data[key] === 'undefined' ? '' : data[key]
				});
			}else if(this.isArray(data)){
				var html='';
				for(var i = 0; i < data.length; i++){
					html+=this.tempStr(str,data[i]);
				}
				return html;
			}else{//如果data不是数组或者对象则直接替代
				return str.replace(/#\{(\w+)\}/g, data);
			}
		}
	});
	//给目标绑定html，定一个以html模板item，数据data
	Cjj.prototype.extend({
		bindHtml:function(item, data){
			var html = '';
			html += this.tempStr(item, data);
			this.html(html);
			return this
		},
		//好像有点vue的感觉
		bindData:function(data){//{ele:标签,data:数据}
			this.html(this.tempStr(this.html(),data));
			return this;
		}
	});

	C.prototype = Cjj.prototype;
}(window);

