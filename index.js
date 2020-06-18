const fetch = require('node-fetch')
const jszip = require('jszip')
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
const targetHTML = path.join(
	__dirname,
	"./voodoo",
	"voodoo.html"
);
const URL = process.argv[2]

/**
 * 修改voodoo.html
 */
function modifyHTML() {
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
		let method = isAppend ? 'append' : 'prepend'
		let tag = isAppend ? 'body' : 'head'
		$(tag)[method](`<script src="./${scriptName}"></script>`)
	}

	ensureScript("data.js");
	ensureScript("webaudio.js");
	ensureScript("mintegral.js", true);

	fs.writeFileSync(targetHTML, $.html());
}


async function download(url) {
	if (url) {
		const fileType = url.split('.').reverse()[0]
		console.log('文件类型：' + fileType);
		if (fileType === 'html') {
			const res = await fetch(url)
			const html = await res.text()
			console.log('HTML解析完成');
			fs.writeFileSync(targetHTML, html)
		} else if (fileType === 'zip') {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/octet-stream'
				}
			})
			console.log('压缩包下载完成。')
			const buffer = await res.buffer()
			const zip = await jszip.loadAsync(buffer)
			const html = await zip.file(Object.keys(zip.files)[0]).async('string')
			console.log('压缩包成功解析')
			fs.writeFileSync(targetHTML, html)
		}
	}
	modifyHTML()
	console.log('HTML修改完成')
}

download(URL)