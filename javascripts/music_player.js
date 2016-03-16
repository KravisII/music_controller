var MusicController = {
	createNew: function () {
		var o = {};
		// 属性
		o.name = "MusicController";

		// 方法
		o.initialize = function () {
			this.setNodeReferences();
		};

		o.setNodeReferences = function () {
			this.audioSource = document.querySelector(".audio-source");

			// slide-bar: 
			this.progressIndicator = document.querySelector(".progress-indicator");
			this.sliderRunnableTrack = document.querySelector("slider-runnable-track");
			this.currentTime = document.querySelector("current-time");
			this.totalTime = document.querySelector("total-time");
			
			// control-panel: 
			
		}

		// 返回并执行的函数
		o.initialize();
		return o;
	}
};

var mc = MusicController.createNew();