var MusicController = {
	createNew: function () {
		var o = {};
		// properties
		o.name = "MusicController";

		// methods
		o.initialize = function () {
			this.deviceDetection();
			this.setNodeReferences();
			// this.stopDefaultEvents();
			this.addEventListeners();
		};

		o.deviceDetection = function () {
			var musicPlayerController = document.querySelector(".music-player-controller");
			if (navigator.userAgent.match(/like Mac OS X/i)) {
                ObjClass.removeClass(musicPlayerController, "no-touch");
            }
		}

		o.setNodeReferences = function () {
			this.audioSource = document.querySelector(".audio-source");

			// slide-bar: 
			this.progressIndicator = document.querySelector(".progress-indicator");
			this.sliderRunnableTrack = document.querySelector(".slider-runnable-track");
			this.currentTime = document.querySelector(".current-time");
			this.totalTime = document.querySelector(".total-time");
			
			// control-panel: 
			this.forwardSpeed = document.querySelector(".forward-speed");
			this.backwardSpeed = document.querySelector(".backward-speed");
			this.forwardButton = document.querySelector(".forward-button");
			this.playPauseButton = document.querySelector(".play-pause-button");
			this.backwardButton = document.querySelector(".backward-button");
		};

		o.addEventListeners = function () {
			// Global
			// css-tricks: Allow :active styles to work in your CSS on a page in Mobile Safari
			document.addEventListener("touchstart", function(){}, true);

			// slide-bar: 


			// control-panel: 
			this.forwardButton.addEventListener("click", this.forwardButtonClick);
			this.playPauseButton.addEventListener("click", this.playPauseButtonClick);
			this.backwardButton.addEventListener("click", this.backwardButtonClick);

			// audioSource
			this.audioSource.addEventListener("canplaythrough", this.audioCanPlaytTrough);
			this.audioSource.addEventListener("play", this.audioIsPlaying);
			this.audioSource.addEventListener("pause", this.audioIsPausing);
			this.audioSource.addEventListener("ratechange", this.onRateChanged);
			this.audioSource.addEventListener("timeupdate", this.onTimeUpdate);
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
			var _nums = [-8, -6, -4, -2, 1, 2, 4, 6, 8];
			var _i = _nums.indexOf(o.audioSource.playbackRate);
			_i += rateFlag;
			if (_i == -1 || _i == 9) {
				_i = _nums.indexOf(1);
			}
			o.audioSource.playbackRate = _nums[_i];
		};

		// audioSource
		o.audioCanPlaytTrough = function () {
			o.removeDisabled();
			o.totalTime.innerText = o.formatPlayTime(o.audioSource.duration);
			o.currentTime.innerText = o.formatPlayTime(o.audioSource.currentTime);
		};

		o.removeDisabled = function () {
			o.playPauseButton.removeAttribute("disabled");
			o.forwardButton.removeAttribute("disabled");
			o.backwardButton.removeAttribute("disabled");
		};

		o.audioIsPlaying = function () {
			o.playPauseButton.setAttribute("value", "pause");
		};

		o.audioIsPausing = function () {
			o.playPauseButton.setAttribute("value", "play");
		};

		o.onRateChanged = function () {
			console.log(o.audioSource.playbackRate);

			var _showSpeed = null;
			var _hideSpeed = null;
			if (o.audioSource.playbackRate < 0) {
				_showSpeed = o.forwardSpeed;
				_hideSpeed = o.backwardSpeed;
			} else {
				_showSpeed = o.backwardSpeed;
				_hideSpeed = o.forwardSpeed;
			}

			_showSpeed.style.visibility = "visible";
			_hideSpeed.removeAttribute("style");

			_showSpeed.innerText = Math.abs(o.audioSource.playbackRate);

			if (o.audioSource.playbackRate == 1) {
				_showSpeed.removeAttribute("style");
			}
		};

		o.onTimeUpdate = function () {
			o.currentTime.innerText = o.formatPlayTime(o.audioSource.currentTime);
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

var ObjClass = {
	hasClass: function (obj, cls) {
		return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	},

	addClass: function (obj, cls) {
		if (!this.hasClass(obj, cls)) {
			obj.className += " " + cls;
		}
	},

	removeClass: function (obj, cls) {
		if (this.hasClass(obj, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			obj.className = obj.className.replace(reg, ' ');
		}
	}
};

var mc = MusicController.createNew();