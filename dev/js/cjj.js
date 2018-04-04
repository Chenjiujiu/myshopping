/**
 * @描述: cjj
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */
~function(w){
	var Cjj = function(ele,parent){
		this.doms = [];
		if(this.isObj(ele)){
			this.doms.push(ele);
			return this;
		}else{
			return this.select(ele,parent);
		}
	};
	Cjj.prototype = {
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
		//选择器
		select:function(ele,parent){
			parent=parent||document;
			//id选择器
			var that = this;
			function id(ele){
				pushDoms([document.getElementById(ele)]);
			}
			// tag选择器
			function tag(ele, context){
				context = context || document;
				pushDoms(context.getElementsByTagName(ele));
			}
			//class选择器
			function cla(ele, context){
				context = context || document;
				ele = that.trim(ele);
				if(!context.getElementsByClassName){
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
			if(document.querySelectorAll){	//支持h5
				all(ele,parent)
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
							cla(sel,parent);
						}
						context = this.doms;
					}else{//标签
						if(context.length){
							for(var k = 0, conlen = context.length; k < conlen; k++){
								tag(item, context[k]);
							}
						}else{
							tag(item,parent);
						}
						context = this.doms;
					}
				}
			}
			return this;
		},
		parent:function(sel){
			var domsparent=[];
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				if(sel){
					sel=this.trim(sel);
					var first=sel.charAt(0);
					var content =sel.slice(1);
					if(first==="#"){	//id的话直接搜索id
						domsparent.push(document.getElementById(content));
					}
					else if(first==="."){
						do{
							var objP=obj.parentNode; //obj的父元素
							var flag = -1 < (" " + objP.className + " ").indexOf(" " + content + " ");
							if(flag){
								domsparent.push(objP);
								this.doms=domsparent;
								return this;
							}
							obj=objP;
						}while(objP.nodeName!=="HTML");
					}
					else{//不是# 也不是. 则查找标签
						do{
							var objP=obj.parentNode; //obj的父元素
							if(objP.nodeName===sel.toUpperCase()){
								domsparent.push(objP);
								this.doms=domsparent;
								return this;
							}
							obj=objP;
						}while(objP.nodeName!=="HTML");
					}
				}else{	//没参数就直接返回父元素
					domsparent.push(obj.parentNode);
				}
			}
			this.doms=domsparent;
			return this;
		},
		child:function(sel){
			var domschild=[];
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				var child=obj.children;
				if(sel){
					sel=this.trim(sel);
					var first=sel.charAt(0);
					var content =sel.slice(1);
					if(first==="#"){	//id的话直接搜索id
						domschild.push(document.getElementById(content));
					}
					else if(first==="."){
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
							if(obj2.nodeName===sel.toUpperCase()){
								domschild.push(obj2);
							}
						}
					}
				}else{	//没参数就直接返回子元素
					domschild=obj.children;
				}
			}
			this.doms=domschild;
			return this;
		},
		firstChild:function(){
			var domschild=[];
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				var child=obj.firstElementChild||obj.firstChild;
				domschild.push(child);
			}
			this.doms=domschild;
			return this
		},
		lastChild:function(){
			var domschild=[];
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				var child=obj.lastElementChild||obj.lastChild;
				domschild.push(child);
			}
			this.doms=domschild;
			return this
		},
		next:function(){
			var domsnext=[];
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				var next=obj.nextElementSibling || obj.nextSibling;
				domsnext.push(next);
			}
			this.doms=domsnext;
			return this;
		},
		prev:function(){
			var domsprev=[];
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				var prev=obj.previousElementSibling || obj.previousSibling;
				domsprev.push(prev);
			}
			this.doms=domsprev;
			return this;
		},
		sibl:function(sel){
			this.parent().child(sel);
			return this;
		},
		//转换dom元素
		get:function(i){
			if(i === undefined){
				return this.doms;
			}else{
				return this.doms[i];
			}
		},
		//基本数据类型检测
		isnumb:function(val){
			return typeof val === 'number';
		},
		isBool:function(val){
			return typeof val === 'boolean';
		},
		isStr:function(val){
			return typeof  val === 'string';
		},
		isUndf:function(val){
			return typeof val === 'undefined';
		},
		isNull:function(val){
			return val === null;
		},
		isObj:function (str){
			if(str === null || typeof str === 'undefined'){
				return false;
			}
			return typeof str === 'object';
		},
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
					obj2.attachEvent('on' + type, fn);
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
		mover:function(fn){
			this.on('mouseover', fn);
			return this;
		},
		mout:function(fn){
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
		// 事件对象
		event:function(event){
			return event ? event : window.event;
		},
		//事件目标
		target:function(event){
			var e = this.event(event);
			return e.target || e.srcElement;
		},
		//阻止默认行为
		preDef:function(event){
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
		},
		//随机数
		random:function(star, end){
			return Math.floor(Math.random() * (end - star)) + star;
		},
		//模版字符串
		tempStr:function(str, data){
			return str.replace(/#\{(\w+)\}/g, function(m, key){
				return typeof data[key] === 'undefined' ? '' : data[key]
			});
		},
		//设置样式,属性,文本
		css:function(k, v){
			if(v){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.style[k] = v;
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
				obj[k] = v;
			}
			return this;
		},
		html:function(h){
			if(h!==undefined){
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
		class:function(c){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj.className =c;
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
				obj.className = (" " + obj.className + " ").replace(" " + c + " ", " ");
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
		},
		//ajax
		ajax:function(arg){//{type,url,data,dataType,fn,callback}
			var datas='';
			for(var k in arg.data){
				datas+="&&"+k+"="+arg.data[k];
			}
			datas=datas.slice(2);
			if(arg.dataType === 'jsonp'){
				var newscript = document.createElement('script');
				newscript.src = arg.url + "?" + datas+ "&&callback=" + arg.callback;
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
		//cookie
		setCookie:function(data){	//{name,value,days,path}
			var cookieText="";
			cookieText+= encodeURIComponent(data.name)+"="+encodeURIComponent(data.value);
			if(data.days){
				var expires=new Date();
				expires.setTime(expires.getTime()+data.days*24*60*60*1000);
				cookieText+=";expires="+expires.toUTCString();
			}
			if(data.path){
				cookieText += "; path=" + data.path;
			}
			if (data.domain) {
				cookieText += "; domain=" + data.domain;
			}
			if (data.secure) {
				cookieText += "; data.secure";
			}
			document.cookie=cookieText;
		}
	};
	// 实例化对象,并返回doms
	w.C = function(ele,parent){
		return new Cjj(ele,parent);
	};
	C.__proto__ = Cjj.prototype;
}(window);
