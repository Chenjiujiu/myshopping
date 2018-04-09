/**
 * @描述: cjj
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */
~function(window){
	var Cjj = function(ele, parent){
		this.doms = [];
		return this.init(ele, parent);
	};
	Cjj.prototype = {
		init:function(ele, parent){

			if(this.isDom(ele)){
				//是对象直接push到doms
				// console.log(ele);
				
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
				//是不是标签 是字符串则是选择器
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
		//模版字符串
		tempStr:function(str, data){
			if(this.isObj(data)){
				return str.replace(/#\{(\w+)\}/g, function(m, key){
					return typeof data[key] === 'undefined' ? '' : data[key]
				});
			}else{
				return str.replace(/#\{(\w+)\}/g, data);
			}
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
				var star = search.indexOf("=", search.indexOf(arg));
				var end = search.indexOf("&", search.indexOf(arg));
				result[arg] = this.trim(search.slice(star + 1, end));
			}
			return result;
		},
		//扩充
		extend:function(){
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
		}
	};
	//数据类型判断
	Cjj.prototype.extend({
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
		isObj:function(val){
			return this.type(val) === "[object Object]";
		},
		isArray:function(val){
			return this.type(val) === "[object Array]";
		},
		isDom:function(obj){
			if(typeof HTMLElement==="object"){
				return obj instanceof HTMLElement;
			}else{
				return obj&&typeof obj==='object'&&obj.nodeType===1;
			}

		}
	});
	//选择框架
	Cjj.prototype.extend({
		//选择器
		select:function(ele, parent){
			parent = parent || document;
			//id选择器
			var that = this;
			function id(ele){
				pushDoms([document.getElementById(ele)]);
				return this;
			}
			// tag选择器
			function tag(ele, context){
				context = context || document;
				pushDoms(context.getElementsByTagName(ele));
				return this;
			}
			//class选择器
			function cla(ele, context){
				context = context || document;
				ele = that.trim(ele);
				if(context.getElementsByClassName){
					pushDoms(context.getElementsByClassName(ele));
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
				pushDoms(context.querySelectorAll(ele));
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
				if(document.querySelectorAll){	//支持h5
					all(ele, parent)
				}else{	//不支持
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
		length:function(){
			return this.doms.length;
		},
	});
	//css属性框架
	Cjj.prototype.extend({
		//设置样式,属性,文本
		css:function(k, v){
			if(v){
				if(k === "opacity"){
					if("opacity" in this.doms[0].style){
						for(var i = 0; i < this.doms.length; i++){
							var obj = this.doms[i];
							obj.style[k] = v;
						}
					}else{
						for(var i = 0; i < this.doms.length; i++){
							var obj = this.doms[i];
							obj.style.filter = "alpha(opacity=" + v * 100 + ")";
						}
					}
				}else{
					for(var i = 0; i < this.doms.length; i++){
						var obj = this.doms[i];
						obj.style[k] = v;
					}
				}

				return this;
			}else{//	如果没有v 则表示获取
				var dom = this.get(0);
				if(document.currentStyle){
					return dom.currentStyle[k];
				}else{
					return getComputedStyle(dom, null)[k];
				}
			}
		},
		attr:function(k, v){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj.setAttribute(k, v);
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
				obj.className = obj.className + " " + c;
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
	Cjj.prototype.extend({
		/*offsetWidth/Height/Left/Top/Parent/返回对象自己的宽高(width+boder+padding),距离上一级定位盒子的左上的位置，返回父级定位盒子。
		window.scrreen.width/height/X/Y/返回屏幕的宽高，距离左上的位置。
		clientWidth/Height/X/Y/返回当前可视区域的宽高，以及光标位于可视区左上的位置。
		pageX/Y,光标相对网页的水平垂直位置 （IE8没有）
		scroll 滚动的
		*/
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
		animate:function(data){
			//	透明度用0-100
			//attr{width:21px,height20px},time:定时器时间间隔 默认10,scale:步长比 默认10,fn：回调函数
			var obj = this.get(0);
			var start = [];	//用来保存属性当前值
			clearInterval(obj.timer);
			var that = this;
			data.time = data.time || 10;
			data.scale = data.scale || 10;
			for(var attr in data.attr){//读取当前属性值保存；
				if(attr === "opacity"){
					start[attr] = parseInt(this.css(attr) * 100) || 0;
				}else{
					start[attr] = parseInt(this.css(attr));//去掉单位
				}
				data.attr[attr] = parseFloat(data.attr[attr]);//转化为数字
			}
			obj.timer = setInterval(function(){
				var flag = true; 	//定时器开关
				for(var attr in data.attr){
					start[attr] = start[attr] + (data.attr[attr] - start[attr]) / data.scale;
					if(Math.abs(data.attr[attr] - start[attr]) < 2){
						start[attr] = data.attr[attr];
					}
					if(attr === "opacity"){
						that.css(attr, start[attr] / 100);
					}else if(attr === "zIndex"){
						that.css(attr, start[attr]);
					}else{
						that.css(attr, start[attr] + "px");
					}
					if(start[attr] !== data[attr]){//只要有一个属性还没达到，则不关闭定时器
						flag = false;
					}
				}
				if(flag){
					clearInterval(obj.timer);
					if(data.fn){	//	如果有回调函数则执行回调函数
						data.fn();
					}
				}

			}, data.time)
		}
	});
	//事件框架
	Cjj.prototype.extend({
		//事件绑定
		on:function(type, fn, b){
			b === undefined ? b = false : b;
			// 正常浏览器
			if(document.addEventListener){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.addEventListener(type, fn, b);
				}
			}else if(document.attachEvent){	//ie
				for(var j = 0; j < this.doms.length; j++){
					var obj2 = this.doms[j];
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
		click:function(fn){
			this.on('click', fn);
			return this;
		},
		mOver:function(fn){
			this.on('mouseover', fn);
			return this;
		},
		mOut:function(fn){
			this.on('mouseout', fn);
			return this;
		},
		hover:function(overfn, outfn){
			if(overfn){
				this.on('mouseover', overfn);
			}
			if(outfn){
				this.on('mouseout', outfn)
			}
			return this;
		},
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
	Cjj.prototype.extend({
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
			}else{
				cookieText += "; path=/";
			}
			if(data.domain){
				cookieText += "; domain=" + data.domain;
			}
			if(data.secure){
				cookieText += "; data.secure";
			}
			document.cookie = cookieText;
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
			})
		}
	});

	// 实例化对象,并返回
	window.C = function(ele, parent){
		return new Cjj(ele, parent);
	};
	C.__proto__ = Cjj.prototype;
}(window);

