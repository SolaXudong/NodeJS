const puppeteer = require('puppeteer-cn');

console.log('start...');
(async() => {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://cn.bing.com');
    await page.screenshot({
        path: './tmp/233.png'
    })
})().then(function(e) {
    console.log('then: ', e);
}).catch(function(e) {
    console.log('catch: ', e);
});
console.log('over...');