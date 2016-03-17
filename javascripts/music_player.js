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
                removeClass(musicPlayerController, "no-touch");
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
			
		};

		// control-panel: 
		o.forwardButtonClick = function () {
			o.changePlayRate(-1);
		};

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
			o.removeDisabled(o.playPauseButton);
			o.removeDisabled(o.forwardButton);
			o.removeDisabled(o.backwardButton);
		};

		o.removeDisabled = function (object) {
			object.removeAttribute("disabled");
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

		o.loadMusic = function () {
			o.audioSource.load();
		};

		// Execute functions and return object
		o.initialize();
		return o;
	}
};

function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
	if (!this.hasClass(obj, cls)) {
		obj.className += " " + cls;
	}
}

function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}

var mc = MusicController.createNew();