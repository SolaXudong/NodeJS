const puppeteer = require('puppeteer-cn');
const srcToImg = require('./srcToImg');
const path = require('path');

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://image.baidu.com/');
    console.log('go to page');

    await page.setViewport({
        width: 1920,
        height: 1080
    });
    console.log('reset viewport');

    await page.focus('#kw');
    await page.keyboard.sendCharacter('狗');
    await page.click('.s_search');
    console.log('go to search list');

    page.on('load', async() => {
        console.log('page loading done, start fetch...');

        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });
        console.log('get ', srcs.length, ' images, start download');

        srcs.forEach(async(src) => {
            // await console.log(src);
            // sleep
            await page.waitFor(200);
            let mn = path.resolve(__dirname, 'tmp/pic');
            await srcToImg(src, mn);
        });

        await console.log('over...');
        await browser.close();

    });
})();