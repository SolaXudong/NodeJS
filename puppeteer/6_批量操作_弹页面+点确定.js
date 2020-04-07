const fs = require('fs');
const puppeteer = require('puppeteer-cn');

(async() => {
    const browser = await (puppeteer.launch({
        executablePath: 'D:\\program\\chrome-win\\chrome',
        headless: false
    }));
    const page = await browser.newPage();

    // 打开主页面
    await page.goto('D:\\java\\newworkspace\\NODE\\NodeJS\\webDevelop\\puppeteer\\list.html');

    // 加载好后，取元素对象
    await page.waitFor(200);
    let iframe = page.mainFrame();
    const LIST = await iframe.$('ul');

    // 跳转到主页面，列表第一个的子页面
    const CHILD = await iframe.evaluate(sel => {
        return $($(sel).find('li abc')[0]).attr('href');
    }, LIST);
    console.log('CHILD[0]: ', CHILD);
    await page.goto(CHILD);

    // 加载好后
    await page.waitFor(200);
    iframe = page.mainFrame();

    // 点击子页面的，按钮
    console.log('Button: ', await iframe.$eval('#cli', element => element.value));
    iframe.click('#cli');

    // 关闭
    await page.waitFor(200);
    await browser.close();
})();