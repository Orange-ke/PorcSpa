/*项目独立全局js*/
mui.ready(function() {
	immersionDeal();
	//openwindow打开窗口
	mui('body').on('tap', '[data-openwindow]', function() {
		openWindow(JSON.parse(this.getAttribute('data-openwindow')));
	});
});

mui.plusReady(function() {
	
});
//打开新页面
function openWindow(customize){
	var _option = {
		show:{
			duration: mui.os.ios ? 200 : 400,
		},
		waiting:{
			autoShow:false
		}
	};
	//判断是否使用原生导航栏
	if(customize.styles && customize.styles.titleNView){
		_option.styles = {
			titleNView: { //详情页原生导航配置
				backgroundColor: '#fff', //导航栏背景色
				autoBackButton: true //自动绘制返回箭头
				//titleText: '', //导航栏标题
				//titleColor: '#000000', //文字颜色
				//type: 'transparent', //透明渐变样式
			}
		};
	}else{
		_option.styles = {
			statusbar:{background:'#fff'}
		};
	}
	_option = mui.extend(true,_option,customize);
	mui.openWindow(_option);
	//去除焦点
	mui('input,textarea').each(function() {
		this.blur();
	});
}
//沉浸式处理
function immersionDeal(){
	var ms = (/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	immersionStatusBarHeight = 0;
	if(ms && ms.length >= 3) { // 当前环境为沉浸式状态栏模式
		immersionStatusBarHeight = parseFloat(ms[2]); // 获取状态栏的高度
		mui('.immersed').each(function(i,n){
			var _paddingTop = parseInt(mui.getStyles(this, 'padding-top'));
			this.style.paddingTop = (_paddingTop + immersionStatusBarHeight) + 'px';
			//判断元素是否要增加高度
			if(this.classList.contains('immersed-height')){
				var _height = parseInt(mui.getStyles(this,'height'));
				this.style.height = (_height + immersionStatusBarHeight) + 'px';
			}
		});
	}
}
//首页tab菜单控制器
function TabBarControl(){
	this.options = {
		ACTIVE_COLOR: "#43AAF7",
		NORMAL_COLOR: "#929292",
		subpages: ["mall", "coupons","policy","my"]
	};
	
	var aniShow = {};
	this.initSubpage(aniShow);
	
	var nview = plus.nativeObj.View.getViewById('tabBar'),
		activePage = plus.webview.currentWebview(),
		targetPage,
		subpages = this.options.subpages,
		pageW = window.innerWidth,
		currIndex = 0,
		_this = this;
	
		
	/**
	 * 根据判断view控件点击位置判断切换的tab
	 */
	nview.addEventListener('click', function(e) {
		var clientX = e.clientX;
		if(clientX > 0 && clientX <= parseInt(pageW * 0.2)) {
			currIndex = 0;
		} else if(clientX > parseInt(pageW * 0.2) && clientX <= parseInt(pageW * 0.4)) {
			currIndex = 1;
		} else if(clientX > parseInt(pageW * 0.4) && clientX <= parseInt(pageW * 0.6)) {
			currIndex = 2;
		} else if(clientX > parseInt(pageW * 0.6) && clientX <= parseInt(pageW * 0.8)) {
			currIndex = 3;
		} else {
			currIndex = 4;
		}
		// 匹配对应tab窗口	
		if(currIndex > 0) {
			targetPage = plus.webview.getWebviewById(subpages[currIndex - 1]);
		} else {
			targetPage = plus.webview.currentWebview();
		}

		if(targetPage != activePage) {
			//底部选项卡切换
			_this.toggleNview(currIndex);
			// 子页面切换
			_this.changeSubpage(targetPage, activePage, aniShow);
			//更新当前活跃的页面
			activePage = targetPage;
		}
	});
}
TabBarControl.prototype = {
	constructor: TabBarControl,
	/**
	 *  简单封装了绘制原生view控件的方法
	 *  绘制内容支持font（文本，字体图标）,图片img , 矩形区域rect
	 */
	drawNative: function(id, styles, tags) {
		var view = new plus.nativeObj.View(id, styles, tags);
		return view;
	},
	/**
	 * 初始化首个tab窗口 和 创建子webview窗口 
	 */
	initSubpage: function(aniShow) {
		var subpage_style = {
				top: 0,
				bottom: 50
				//statusbar:{background: "#fff"}
			},
			subpages = this.options.subpages,
			self = plus.webview.currentWebview(),
			temp = {};
			
		//兼容安卓上添加titleNView 和 设置沉浸式模式会遮盖子webview内容
		/*if(mui.os.android) {
			if(plus.navigator.isImmersedStatusbar()) {
				subpage_style.top += plus.navigator.getStatusbarHeight();
			}
			if(self.getTitleNView()) {
				subpage_style.top += 40;
			}
			
		}*/

		// 初始化第一个tab项为首次显示
		temp[self.id] = "true";
		mui.extend(aniShow, temp);
		// 初始化绘制首个tab按钮
		this.toggleNview(0);

		for(var i = 0, len = subpages.length; i < len; i++) {

			if(!plus.webview.getWebviewById(subpages[i])) {
				//if(subpages[i] == 'my') subpage_style.statusbar.background = '#028EFF';
				var sub = plus.webview.create(subpages[i] + '.html', subpages[i], subpage_style);
				//初始化隐藏
				sub.hide();
				// append到当前父webview
				self.append(sub);
			}
		}
	},
	/**	
	 * 点击切换tab窗口 
	 */
	changeSubpage: function(targetPage, activePage, aniShow) {
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetPage]) {
			plus.webview.show(targetPage);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetPage] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetPage, "fade-in", 300);
		}
		//隐藏当前 除了第一个父窗口
		if(activePage !== plus.webview.getLaunchWebview()) {
			plus.webview.hide(activePage);
		}
	},
	/**
	 * 点击重绘底部tab （view控件）
	 */
	toggleNview: function(currIndex) {
		currIndex = currIndex * 2;
		// 重绘当前tag 包括icon和text，所以执行两个重绘操作
		this.updateSubNView(currIndex, this.options.ACTIVE_COLOR);
		this.updateSubNView(currIndex + 1, this.options.ACTIVE_COLOR);
		// 重绘兄弟tag 反之排除当前点击的icon和text
		for(var i = 0; i < 10; i++) {
			if(i !== currIndex && i !== currIndex + 1) {
				this.updateSubNView(i, this.options.NORMAL_COLOR);
			}
		}
	},
	/*
	 * 改变颜色
	 */
	changeColor: function(obj, color) {
		obj.color = color;
		return obj;
	},
	/*
	 * 利用 plus.nativeObj.View 提供的 drawText 方法更新 view 控件
	 */
	updateSubNView: function(currIndex, color) {
		var self = plus.webview.currentWebview(),
			nviewEvent = plus.nativeObj.View.getViewById("tabBar"), // 获取nview控件对象
			nviewObj = self.getStyle().subNViews[0], // 获取nview对象的属性
			currTag = nviewObj.tags[currIndex]; // 获取当前需重绘的tag

		nviewEvent.drawText(currTag.text, currTag.position, this.changeColor(currTag.textStyles, color), currTag.id);
	}
};