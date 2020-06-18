(function () {
	function log(msg) {
		console.log(`%c ${msg} `, "color:#000;background-color:#fff");

	}
	document.addEventListener("PLAYABLE:gameStart", function () {
		window.playEnterSound &&
			window.playEnterSound("resource/bgm.mp3", arguments);
		log && log("gameStart");
	}, false)


	document.addEventListener("PLAYABLE:gameReady", function () {
		log && log("gameReady");
	}, false)

	document.addEventListener("PLAYABLE:install", function () {
		window.gameEnd && window.gameEnd();
		log && log("install");
	}, false);

	document.addEventListener("PLAYABLE:ending", function () {
		log && log("gameEnd");
	}, false);

	document.addEventListener("PLAYABLE:gameClose", function () {
		window.destorySound && window.destorySound(arguments);
		log && log("gameClose");
	}, false);

	window._voodooExit = function () {
		window.install && window.install()
		log && log("_voodooExit: install")
	}
})()