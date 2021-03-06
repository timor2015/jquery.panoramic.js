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
		'float' : null,
		'img' : null,
		'restart' : false,
	}


	// 插件初始化中用到的css设置
	var cssCode = {
		'panor' : 'position:relative; overflow:hidden;',
		'float' : 'background: #fff; opacity:0; filter:alpha(opacity=0); z-index: 222; width: inherit; height: inherit; position: absolute; cursor: move; left: 0px; top: 0px;',
		'box' : 'z-index: 0; width: inherit; height: inherit; position: absolute; left: 0px; top: 0px;',
		'img' : 'height: inherit; position: absolute; top: 0px; left: 0px;',
		'pic' : 'height: inherit; position: absolute; top: 0px; border: 0px;',
	}	


	// 注册插件运行中用到的函数
	var methods = {
		// cssInit
		'cssInit' : function(that){
			var content = that.find('.panor_img').html();
			that.find('.panor_img').html(content+content+content);
			that.attr('style', cssCode.panor);
			para.float.attr('style', cssCode.float);
			that.find('.panor_box').attr('style', cssCode.box);
			para.img.attr('style', cssCode.img);			
			that.find('.panor_img img').attr('style', cssCode.pic);	
		},

		// 图片位置重置
		'resetImgPos' : function(){
			if (para.nowImgPos > para.imgLength*(-1) && para.nowImgPos < 0) {
				para.img.css({
					'left' : para.nowImgPos + para.imgLength*(-1),
				})
			}
			if (para.nowImgPos > para.imgLength*(-3) && para.nowImgPos < para.imgLength*(-2)) {
				para.img.css({
					'left' : para.nowImgPos + para.imgLength,
				})
			}	
		},

		// 设定定时器
		'autogo' : function(settings){
			para.timer = setInterval(function(){
				var dir = para.dir == 'left' ? settings.auto.stepwidth*(-1) : settings.auto.stepwidth;
				para.nowImgPos = parseInt(para.img.css('left'));
				para.img.css({
					'left' : para.nowImgPos + dir + 'px',
				});
				methods.resetImgPos();
			}, 50);
		},
	}


	// 插件启动函数
    $.fn.panoramic = function (options) {

    	// 设定参数的覆盖顺序()
		var settings = $.extend( {}, defaults, options);
		settings.auto = $.extend(defaults.auto, options.auto);
		para.float = $(this).find('.panor_float');
		para.img = $(this).find('.panor_img');
		

		
		// 给标签添加css初始化代码
		methods.cssInit(this);

		para.imgLength = parseInt(this.find('.panor_img img').width());

		// 根据图片宽度设定panor_img的宽度
		para.img.width(para.imgLength*3);
		para.img.css('left', para.imgLength*(-1));

		// 给图片添加left值
		this.find('.panor_img img:nth-child(1)').css('left', 0);
		this.find('.panor_img img:nth-child(2)').css('left', para.imgLength);
		this.find('.panor_img img:nth-child(3)').css('left', para.imgLength*2);

		// 添加鼠标按下事件
		para.float.on('mousedown', function(e){
			e.preventDefault();
			clearInterval(para.timer);
			para.restart = true;
			para.touchOff = true;
			para.pastPos = e.originalEvent.x || e.originalEvent.layerX || 0;
		});


		// 鼠标抬起事件
		$('html').on('mouseup', function(e){
			getout(e);
			
		})

		function getout(e){
			e.preventDefault();
			if (para.restart) {
				para.touchOff = false;
				clearInterval(para.timer);
				para.timer = null;
				methods.resetImgPos();
				if (para.timerOff) {
					clearInterval(para.timer);
					para.timerOff = false;
					setTimeout(function(){
						methods.autogo(settings);
						para.timerOff = true;
					}, settings.auto.startdelay);
				};
				para.restart = false;
			}
		}

		// 移动端事件
		para.float.on('touchstart', function(e){
			e.preventDefault();
			clearInterval(para.timer);
			para.restart = true;
			para.touchOff = true;
			para.pastPos = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
		});

		$('html').on('touchend', function(e){
			getout(e);
		});



		// 鼠标移动事件(用户可能会鼠标移出float层, 所有使用委托)
		$('html').on('mousemove', function(e){
			e.preventDefault();
			if (e.target.className != 'panor_float') {
				para.touchOff = false;
				methods.resetImgPos();
				return;
			}
			if (para.touchOff) {
				para.nowPos = e.originalEvent.x || e.originalEvent.layerX || 0;
				var iLength = para.nowPos - para.pastPos;
				if (iLength > 0) {
					para.dir = 'right';
				}else{
					para.dir = 'left';
				}
				para.pastPos = para.nowPos;
				para.nowImgPos = parseInt(para.img.css('left'));
				para.img.css('left', para.nowImgPos+iLength);
			}			
		});

		$('html').on('touchmove', function(e){
			e.preventDefault();
			if (e.target.className != 'panor_float') {
				para.touchOff = false;
				methods.resetImgPos();
				return;
			}
			if (para.touchOff) {
				para.nowPos = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
				var iLength = para.nowPos - para.pastPos;
				if (iLength > 0) {
					para.dir = 'right';
				}else{
					para.dir = 'left';
				}
				para.pastPos = para.nowPos;
				para.nowImgPos = parseInt(para.img.css('left'));
				para.img.css('left', para.nowImgPos+iLength);
			}			
		});

		// 自动播放
		if (settings.autoplay) {
			methods.autogo(settings);
		}

		// 返回jquery对象, 保持链式操作
		return this;
	};


})(jQuery,window,document);