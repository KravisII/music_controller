var MusicController = {
	createNew: function () {
		var o = {};
		// properties
		o.name = "MusicController";
		o.musicStatus = null;
		o.playRateValues = null;
		o._preRateFlag = null;
		o.audioSource = document.querySelector(".audio-source");

		// methods
		o.initialize = function () {
			this.deviceDetection();
			this.setNodeReferences();
			this.dataInitialize();
			this.addEventListeners();
		};

		o.deviceDetection = function () { 
			this.interfaceControl();
			this.playRateControl();
			this.autoLoadControl();

			this.tc = TipController.createNew();
		};

		o.interfaceControl = function () {
			var musicController = document.querySelector(".music-controller");
			var userAgentContainer = document.querySelector(".user-agent-container");

			if (is.touchDevice()) {
                ObjClass.removeClass(musicController, "no-touch");
            }

            if (Modernizr.backdropfilter) {
			  	// supported
			} else {
				ObjClass.addClass(musicController, "no-backdrop-filter white");
				ObjClass.addClass(userAgentContainer, "no-backdrop-filter white");
			}
		};

		o.playRateControl = function () {
			var _numsSafari = [-8, -6, -4, -2, 1, 2, 4, 6, 8];
			var _numsOther = [1, 2, 4];

			if (is.safari()) {
				o.playRateValues = _numsSafari;
			} else {
				o.playRateValues = _numsOther;
			}
		};

		o.autoLoadControl = function () {
			if (is.desktop() && ((o.audioSource.preload != "auto") || o.audioSource.networkState != 2)) { // NETWORK_LOADING
				this.loadMusic();
			}
			// (HTML 5 Audio/Video DOM networkState 属性)[http://www.w3school.com.cn/tags/av_prop_networkstate.asp]
		};

		o.setNodeReferences = function () {
			// music-controller
			this.inner = document.querySelector(".music-controller-inner");
			this.loading = document.querySelector(".music-controller-loading");
			this.setSpin();
			
			// slide-bar: 
			this.progressIndicator = document.querySelector(".progress-indicator");
			this.sliderRunnableTrack = document.querySelector(".slider-runnable-track");
			this.slideBar = document.querySelector(".slide-bar");
			this.currentTime = document.querySelector(".current-time");
			this.totalTime = document.querySelector(".total-time");
			
			// control-panel: 
			this.forwardSpeed = document.querySelector(".forward-speed");
			this.backwardSpeed = document.querySelector(".backward-speed");
			this.forwardButton = document.querySelector(".forward-button");
			this.playPauseButton = document.querySelector(".play-pause-button");
			this.backwardButton = document.querySelector(".backward-button");
		};

		o.setSpin = function () {
			var setting = {lines: 9, length: 0, width: 6, radius: 12, scale: 1, corners: 1, color: '#000', opacity: 0.35, rotate: 2, direction: 1, speed: 1, trail: 72, fps: 20, zIndex: 2e9, className: 'spinner', top: '50%', left: '50%', shadow: false, hwaccel: false, position: 'absolute'};
			var spinner = new Spinner(setting).spin(o.loading);
		};

		o.dataInitialize = function () {
			this.progressIndicator.value = 0;
		};

		o.addEventListeners = function () {
			// Global
				// css-tricks: Allow `:active` styles to work in your CSS on a page in Mobile Safari
			document.addEventListener("touchstart", function(){}, true);

			// slide-bar: 
			this.progressIndicator.addEventListener("input", this.valueChanging);
			this.progressIndicator.addEventListener("change", this.valueChanged);

			// control-panel: 
			this.forwardButton.addEventListener("click", this.forwardButtonClick);
			this.playPauseButton.addEventListener("click", this.playPauseButtonClick);
			this.backwardButton.addEventListener("click", this.backwardButtonClick);

			// audioSource
			this.audioSource.addEventListener("canplaythrough", this.audioCanPlayTrough);
			this.audioSource.addEventListener("play", this.audioIsPlaying);
			this.audioSource.addEventListener("pause", this.audioIsPausing);
			this.audioSource.addEventListener("ratechange", this.onRateChanged);
			this.audioSource.addEventListener("timeupdate", this.onTimeUpdate);
		};

		// slide-bar: 
		o.valueChanging = function () {
			if (o.musicStatus == null) {
				o.musicStatus = o.audioSource.paused;
				o.pauseMusic();
				ObjClass.addClass(o.slideBar, "seeking");
			}
			
			o.setSlideBar(o.progressIndicator.value);
		};

		o.setSlideBar = function (_time) {
			this.currentTime.innerText = this.formatPlayTime(_time);
			var _percent = (_time / this.audioSource.duration) * 100;
			this.sliderRunnableTrack.style.background = "linear-gradient(90deg, rgba(255, 255, 255, .62) 0%, rgba(255, 255, 255, .62) "+ _percent + "%, rgba(0, 0, 0, .62) "+ _percent + "%, rgba(0, 0, 0, .62) 100%)";
		};

		o.valueChanged = function () {
			if (o.musicStatus == false) {
				o.playMusic();
			}
			o.musicStatus = null;
			o.audioSource.currentTime = o.progressIndicator.value;
			ObjClass.removeClass(o.slideBar, "seeking");
		};

		// control-panel: 
		o.playPauseButtonClick = function () {
			var _controlMusic = this.getAttribute("value") === "play" ? o.playMusic : o.pauseMusic;
			_controlMusic();
		};

		o.playMusic = function () {
			o.audioSource.play();
		};

		o.pauseMusic = function () {
			o.audioSource.pause();
			o.audioSource.playbackRate = 1;
		};

		o.forwardButtonClick = function () {
			o.changePlayRate(-1);
		};

		o.backwardButtonClick = function () {
			o.changePlayRate(1);
		};

		o.changePlayRate = function (rateFlag) {
			var _i = o.playRateValues.indexOf(o.audioSource.playbackRate);
			if (o._preRateFlag != rateFlag) {
				_i = o.playRateValues.indexOf(1);
				o._preRateFlag = rateFlag;
			}
			_i += rateFlag;
			if (_i == -1 || _i == (o.playRateValues.length)) {
				_i = o.playRateValues.indexOf(1);
			}
			o.audioSource.playbackRate = o.playRateValues[_i];
		};

		// audioSource
		o.audioCanPlayTrough = function () {
			o.progressIndicator.max = parseInt(o.audioSource.duration, 10);
			o.currentTime.innerText = o.formatPlayTime(o.audioSource.currentTime);
			o.totalTime.innerText = o.formatPlayTime(o.audioSource.duration);
			o.removeButtonsDisabled();
			ObjClass.addClass(o.inner, "show");
			ObjClass.addClass(o.loading, "hide")
		};

		o.removeButtonsDisabled = function () {
			o.playPauseButton.removeAttribute("disabled");
			if (!(is.chrome() && is.android())) {
				o.backwardButton.removeAttribute("disabled");
			}
			if (is.safari() || is.ios()) {
				o.forwardButton.removeAttribute("disabled");
			}

			if (o.backwardButton.hasAttribute("disabled") &&
				o.forwardButton.hasAttribute("disabled")) {
				ObjClass.addClass(o.backwardButton, "hide");
				ObjClass.addClass(o.forwardButton, "hide");

				var _bts = document.querySelector(".control-panel .buttons");
				ObjClass.addClass(_bts, "center");
			}

		};

		o.audioIsPlaying = function () {
			o.playPauseButton.setAttribute("value", "pause");
		};

		o.audioIsPausing = function () {
			o.playPauseButton.setAttribute("value", "play");
		};

		o.onRateChanged = function () {
			var _showSpeed = null;
			var _hideSpeed = null;
			if (o.audioSource.playbackRate < 0) {
				_showSpeed = o.forwardSpeed;
				_hideSpeed = o.backwardSpeed;
			} else {
				_showSpeed = o.backwardSpeed;
				_hideSpeed = o.forwardSpeed;
			}
			ObjClass.addClass(_showSpeed, "visible");
			ObjClass.removeClass(_hideSpeed, "visible");
			_showSpeed.innerText = Math.abs(o.audioSource.playbackRate);
			if (o.audioSource.playbackRate == 1) {
				ObjClass.removeClass(_showSpeed, "visible");
			}
		};

		o.onTimeUpdate = function () {
			o.progressIndicator.value = parseInt(o.audioSource.currentTime, 10);
			o.setSlideBar(o.progressIndicator.value);
		};

		o.formatPlayTime = function (time) {
			var _secTime = parseInt(time, 10);
			var _minutes = Math.floor(_secTime / 60);
			var _seconds = _secTime - _minutes * 60;
			if (_minutes < 10) {_minutes = "0" + _minutes;}
			if (_seconds < 10) {_seconds = "0" + _seconds;}
			return _minutes + ":" + _seconds;
		}

		o.loadMusic = function () {
			o.audioSource.load();
		};

		// Execute functions and return object
		o.initialize();
		return o;
	}
};

var TipController = {
	createNew: function () {
		var o = {};
		// properties
		o.name = "TipController";
		
		// methods
		o.initialize = function () {
			this.setNodeReferences();
			this.setNodeEvents();
			this.deviceDetection();
		};

		o.setNodeReferences = function () {
			this.tipOverlay = document.querySelector("div.tip-overlay");
			this.wrapper = document.querySelector(".wrapper");
			this.body = document.querySelector("body");

			this.cancelLink = document.querySelector(".tip-overlay a.cancel");
			this.continueLink = document.querySelector(".tip-overlay a.continue");
		};

		o.setNodeEvents = function () {
			this.cancelLink.onclick = function () {
				open(location, '_self').close();
				return false;
			};

			this.continueLink.onclick = function () {
				o.closeTip();
				return false;
			};
		};

		o.deviceDetection = function () {
			if (is.desktop()) {
				// Desktop Events
			} else {
				// Mobile Events
				this.showTip();
				if (is.android() && is.not.chrome()) {
					this.androidChromeTip();
				}
			}

			if (Modernizr.backdropfilter) {
			  	// supported
			} else {
				ObjClass.addClass(this.tipOverlay, "no-backdrop-filter black");
			}

		};

		o.androidChromeTip = function () {
			var _tpcon = this.tipOverlay.querySelector(".tip-container");
			var _p = _tpcon.querySelector("p:nth-child(2)");

			var _newNode = document.createElement("h2");
			_newNode.innerHTML = "请使用 Chrome 浏览器";
    		_tpcon.insertBefore(_newNode, _p.nextSibling);

			var _newNode2 = document.createElement("p");
			_newNode2.innerHTML = "您当前正在使用 Android 系统，建议使用 Chrome 浏览器访问此页面以获得最佳体验。";
    		_tpcon.insertBefore(_newNode2, _newNode.nextSibling);
		};

		o.showTip = function () {
			this.disableScroll();
			ObjClass.addClass(this.tipOverlay, "show");
		};

		o.closeTip = function () {
			ObjClass.removeClass(this.tipOverlay, "show");
			o.enableScroll();
			mc.loadMusic();
		};

		o.disableScroll = function () {
			ObjClass.addClass(this.body, "disableScroll"); // For desktop
			document.ontouchmove = function(event){ // For mobile
			    event.preventDefault();
			};
		};

		o.enableScroll = function () {
			ObjClass.removeClass(this.body, "disableScroll");
			document.ontouchmove = null;
		};

		// Execute functions and return object
		o.initialize();
		return o;
	}
};

var ObjClass = {
	hasClass: function (obj, cls) {return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));},
	addClass: function (obj, cls) {if (!this.hasClass(obj, cls)) {obj.className += " " + cls;}},
	removeClass: function (obj, cls) {if (this.hasClass(obj, cls)) {var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)'); obj.className = obj.className.replace(reg, ' ');}}
};

var mc = MusicController.createNew();

var ua = document.querySelector(".user-agent");
ua.innerText = navigator.userAgent;