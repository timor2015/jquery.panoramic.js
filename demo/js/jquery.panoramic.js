;(function($,window,document,undefined){
	// 代码开始


	// 设定插件的默认参数设置
	var defaults = {

		// 图片是否自动转动
		'autoplay' : false,
		'auto' : {
			// 默认转向的方向
			'dir' : 'left',
			// 自动转动时每步步长
			'stepwidth' : 5,
			// 再次启动的延迟时间
			'startdelay' : 2000
		}
	}


	// 插件运行过程中需要用到的参数
	var para = {
		'dir' : 'left',
		'touchOff' : false,
		'pastPos' : 0,
		'nowPos' : 0,
		'nowImgPos' : 0,
		'imgLength' : 0,
		'timer' : null,
		'timerOff' : true,
	}


	// 插件初始化中用到的css设置
	var cssCode = {
		'panor' : 'position:relative; overflow:hidden;',
		'float' : 'z-index: 999; width: inherit; height: inherit; position: absolute; cursor: move; left: 0px; top: 0px;',
		'box' : 'width: inherit; height: inherit; position: absolute; left: 0px; top: 0px;',
		'img' : 'height: inherit; position: absolute; top: 0px;',
		'pic' : 'height: inherit; float: left; border: 0px;',
	}	


	// 注册插件运行中用到的函数
	var methods = {
		// cssInit
		'cssInit' : function(that){
			var content = that.find('.panor_img').html();
			that.find('.panor_img').html(content+content+content);
			that.attr('style', cssCode.panor);
			that.find('.panor_float').attr('style', cssCode.float);
			that.find('.panor_box').attr('style', cssCode.box);
			that.find('.panor_img').attr('style', cssCode.img);
			that.find('.panor_img img').attr('style', cssCode.pic);	
		},
	}


	// 插件启动函数
    $.fn.panoramic = function (options) {

    	// 设定参数的覆盖顺序()
		var settings = $.extend( {}, defaults, options);
		settings.auto = $.extend(defaults.auto, options.auto);
		

		// 给标签添加css初始化代码
		methods.cssInit(this);
		cssCode = null;



		// 返回jquery对象, 保持链式操作
		return this;
	};


})(jQuery,window,document);