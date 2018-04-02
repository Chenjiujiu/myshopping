/**
 * @描述: cjj
 * @作者: chenjiujiu
 * @创建日期: 2018/4/2
 */
~function(w){
	var Cjj = function(ele){
		this.doms = [];
		return this.select(ele);
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
		select:function(ele){
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
				all(ele)
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
							cla(sel);
						}
						context = this.doms;
					}else{//标签
						if(context.length){
							for(var k = 0, conlen = context.length; k < conlen; k++){
								tag(item, context[k]);
							}
						}else{
							tag(item);
						}
						context = this.doms;
					}
				}
			}
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
		//事件绑定
		on:function(type, fn,b){
			b===undefined?b=false:b;
			// 正常浏览器
			if(document.addEventListener){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.addEventListener(type, fn, b);
				}
			}else if(document.attachEvent){	//ie
				for(var j = 0; j < this.doms.length; j++){
					var obj2 = this.doms[j];
					obj2.attachEvent('on'+type, fn);
				}
			}
		},
		un:function(type,fn){
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
		},
		click:function(fn){
			this.on('click',fn);
		},
		mover:function(fn){
			this.on('mouseover',fn);
		},
		mout:function(fn){
			this.on('mouseout',fn);
		},
		hover:function(overfn,outfn){
			if(overfn){
				this.on('mouseover',overfn);
			}
			if(outfn){
				this.on('mouseout',outfn)
			}
		},
		// 事件对象
		event:function(event){
			return	event?event:window.event;
		},
		//事件目标
		target:function(event){
			var e=this.event(event);
			return e.target||e.srcElement;
		},
		//阻止默认行为
		preDef:function(event){
			var e=this.event(event);
			if(e.preventDefault){
				e.preventDefault();
			}else{
				e.returnValue=false;
			}
		},
		//阻止冒泡
		stopProp:function(event){
			var e =this.event(event);
			if(e.stopPropagation){
				e.stopPropagation();
			}else{
				e.cancelBubble=true;
			}
		},
		//随机数
		random:function(star,end){
			return Math.floor(Math.random()*(end-star))+star;
		},
		//模版字符串
		tempStr:function(str,data){
			return str.replace(/#\{(\w+)\}/g,function(m,key){
				return typeof data[key]==='undefined'?'':data[key]
			});
		},
		//设置样式,属性,文本
		css:function(k,v){
			if(v){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.style[k]=v;
				}
				return this;
			}else{//	如果没有v 则表示获取
				var dom=this.get(0);
				if(document.currentStyle){
					return dom.currentStyle[k];
				}else{
					return getComputedStyle(dom,null)[k];
				}
			}
		},
		attr:function(k,v){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj[k]=v;
			}
			return this;
		},
		html:function(h){
			if(h){
				for(var i = 0; i < this.doms.length; i++){
					var obj = this.doms[i];
					obj.innerHTML=h;
				}
				return this;
			}else{
				return this.get(0).innerHTML;
			}
		},
		//添加,移除,判断class
		addClass:function(c){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj.className=obj.className+" "+c;
			}
			return this;
		},
		remClass:function(c){
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				obj.className=(" "+obj.className+" ").replace(" "+c+" "," ");
			}
			return this;
		},
		hasClass:function(c){
			var flag=false;
			for(var i = 0; i < this.doms.length; i++){
				var obj = this.doms[i];
				flag=-1<(" "+obj.className+" ").indexOf(" "+c+" ");
			}
			return flag;
		},
		//显示隐藏元素
		show:function(){
			this.css('display','block');
			return this;
		},
		hide:function(){
			this.css('display','none');
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
	};
	//实例化对象,并返回doms
	w.C = function(ele){
		return new Cjj(ele);
	};

}(window);







