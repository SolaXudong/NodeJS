// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-cn');
const cheerio = require('cheerio');
const chalk = require('chalk');

(async() => {
    const browser = await (puppeteer.launch({
        // xecutablePath: 'D:\\program\\chrome-win\\chrome',
        // eadless: false
        executablePath: 'D:\\program\\chrome-win\\chrome',
        headless: false
    }));
    const page = await browser.newPage();
    // 进入页面
    await page.goto(
        // 淘宝-狗
        // 'https://s.taobao.com/search?initiative_id=tbindexz_20170306&ie=utf8&spm=a21bo.2017.201856-taobao-item.2&sourceId=tb.index&search_type=item&ssid=s5-e&commend=all&imgfile=&q=%E7%8B%97&suggest=history_1&_input_charset=utf-8&wq=&suggest_query=&source=suggest'
        // 淘宝-猫
        // 'https://s.taobao.com/search?q=%E7%8C%AB&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20190506&ie=utf8'
        // 知乎-话题
        'https://www.zhihu.com/topic/19555513/hot'
    );
    // 获取页面标题
    let title = await page.title();
    console.log(chalk.red('start: ', title));

    let hh = await page.content();
    $ = cheerio.load(hh);

    // // 淘宝
    // let tt = $('div[class="items"]');
    // console.log($(tt).find('div[class^="item J_MouserOnverReq"]').length);
    // $(tt).find('div[class^="item J_MouserOnverReq"]').each((i, el) => {
    // console.log('    ', $(el).find(' > div').eq(1).text().replace(/\s/g, ''));
    // });

    //知乎-话题
    let tt = $('div[class="List"]');
    console.log($(tt).find('div[class="List-item TopicFeedItem"]').length);
    $(
        tt).find('div[class="List-item TopicFeedItem"]').each((i, el) => {
        console.log('    ', $(el).find(' > div').eq(0).find('h2').text().replace(/\s/g, ''));
    });
    const cost = Date.now();
    let timer = setInterval(async() => {
        // 滚动一：回车
        // await page.keyboard.press('PageDown'); // 不好用 window.scrollTo(0, 1000);
        // await page.keyboard.press('PageDown');
        // 滚动二：
        page.evaluate(async() => {
            window.scrollBy(0, 500);
        });
        // await page.waitFor(100);
        // 取元素
        hh = await page.content();
        $ = cheerio.load(hh);
        tt = $('div[class="List"]');
        console.log($(tt).find('div[class="List-item TopicFeedItem"]').length);
        $(tt).find('div[class="List-item TopicFeedItem"]').each((i, el) => {
            // console.log('    ', $(el).find(' > div').eq(0).find('h2').text().replace(/\s/g, ''));
        });
        if ((Date.now() - cost) > 10000) {
            clearInterval(timer);
        }
    }, 100);

    console.log(chalk.red('over...'));
    // browser.close();
})();