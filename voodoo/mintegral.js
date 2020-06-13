/**
 * 劫持原函数并在之后注入自定义操作
 * @param {Function} orgFunc 原函数
 * @param {Function} hookFunc 自定义函数
 */
function withHookAfter(orgFunc, hookFunc) {
	return function () {
		orgFunc && orgFunc.apply(this, arguments);
		return hookFunc.apply(this, arguments);
	};
}

function log(msg) {
	console.log(`%c ${msg} `, "color:#000;background-color:#fff");
}

window.gameStart = withHookAfter(window.gameStart, function () {
	window.playEnterSound &&
		window.playEnterSound("resource/bgm.mp3", arguments);
	log("gameStart");
});
window.gameReady = withHookAfter(window.gameReady, () => {
	log("gameReady");
});
window.install = withHookAfter(window.install, () => {
	if (window.install.caller === window.gameEnd) return; // 防止死循环
	window.gameEnd && window.gameEnd();
	log("install");
});
window.gameEnd = withHookAfter(window.gameEnd, () => {
	if (window.install.caller) return; // 防止连续两次gameEnd
	if (!window.gameEnd.caller) window.install && window.install();
	log("gameEnd");
});
window.gameClose = withHookAfter(window.gameClose, function () {
	window.destorySound && window.destorySound(arguments);
	log("gameClose");
});
