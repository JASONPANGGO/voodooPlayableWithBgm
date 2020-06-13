const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const targetHTML = path.join(
	__dirname,
	"./voodoo",
	"voodoo.html"
);
const $ = cheerio.load(fs.readFileSync(targetHTML));

/**
 * 检测是否有引用这个script
 * @param {string} scriptName
 */
function hasScript(scriptName) {
	const scripts = $("html").find("script").toArray();
	return scripts.some(
		(script) => script.attribs.src && script.attribs.src.match(scriptName)
	);
}

/**
 * 检查是否有引用该脚本如果没就插入
 * @param {string} scriptName 脚本名称
 * @param {boolean} isAppend 是否在之后插入
 */
function ensureScript(scriptName, isAppend = false) {
	if (hasScript(scriptName)) return;
	if (isAppend) $("body").append(`<script src="./${scriptName}"></script>`);
	else $("body").prepend(`<script src="./${scriptName}"></script>`);
}

ensureScript("data.js");
ensureScript("webaudio.js");
ensureScript("mintegral.js", true);

fs.writeFileSync(targetHTML, $.html());

