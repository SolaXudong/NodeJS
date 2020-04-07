const puppeteer = require('puppeteer');
// const {screenshot} = require('./default');

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://www.baidu.com');
	await page.screenshot({
		path: 'example.png'
		// path: `${screenshot}/${Date.now()}.png`
		// path: screenshot / Date.now() + '.png'
	});
	await browser.close();
})();
