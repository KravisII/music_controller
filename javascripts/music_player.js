var MusicController = {
	createNew: function () {
		var o = {};
		// properties
		o.name = "MusicController";

		// methods
		o.initialize = function () {
			this.setNodeReferences();
			this.stopDefaultEvents();
			this.addEventListeners();
		};

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

		o.stopDefaultEvents = function () {
			var Atags = document.querySelectorAll(".control-panel a");
			for (var i = Atags.length - 1; i >= 0; i--) {
				Atags[i].onclick = function () {
					return false;
				};
			}
		};

		o.addEventListeners = function () {
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

var mc = MusicController.createNew();