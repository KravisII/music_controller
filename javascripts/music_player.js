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
		};

		o.playPauseButtonClick = function () {
			o.controlMusic = this.getAttribute("value") === "play" ? o.playMusic : o.pauseMusic;
			o.controlMusic();
		};

		o.playMusic = function () {
			this.playPauseButton.setAttribute("value", "pause");
			this.audioSource.play();
		};

		o.pauseMusic = function () {
			this.playPauseButton.setAttribute("value", "play");
			this.audioSource.pause();
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