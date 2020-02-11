const fs = require('fs');
const puppeteer = require('puppeteer-cn');

(async() => {
    const browser = await (puppeteer.launch({
        executablePath: 'D:\\program\\chrome-win\\chrome',
        headless: false
    }));
    const page = await browser.newPage();
    // 进入页面
    await page.goto('https://music.163.com/#');

    // 点击搜索框拟人输入 鬼才会想起 醉赤壁
    const musicName = '醉赤壁';
    await page.type('.txt.j-flag', musicName, {
        delay: 0
    });

    // 回车
    await page.keyboard.press('Enter');

    // 获取歌曲列表的 iframe
    await page.waitFor(2000);
    let iframe = await page.frames().find(f => f.name() === 'contentFrame');
    const SONG_LS_SELECTOR = await iframe.$('.srchsongst');

    // 获取歌曲 鬼才会想起 的地址
    const selectedSongHref = await iframe.evaluate(e => {
        const songList = Array.from(e.childNodes);
        // const idx = songList.findIndex(v => v.childNodes[1].innerText.replace(/\s/g, '') === '鬼才会想起');
        const idx = songList.findIndex(v => v.childNodes[1].childNodes[0].childNodes[0].childNodes[0].innerText.replace(/\s/g, '') === '醉赤壁');
        return songList[idx].childNodes[1].firstChild.firstChild.firstChild.href;
    }, SONG_LS_SELECTOR);

    // 进入歌曲页面
    console.log('selectedSongHref: ', selectedSongHref);
    await page.goto(selectedSongHref);

    // 获取歌曲页面嵌套的 iframe
    await page.waitFor(2000);
    iframe = await page.frames().find(f => f.name() === 'contentFrame');

    // 点击 展开按钮
    const unfoldButton = await iframe.$('#flag_ctrl');
    await unfoldButton.click();

    // 获取歌词
    const LYRIC_SELECTOR = await iframe.$('#lyric-content');
    const lyricCtn = await iframe.evaluate(e => {
        return e.innerText;
    }, LYRIC_SELECTOR);

    // console.log(lyricCtn);

    // 截图
    await page.screenshot({
        path: 'tmp/歌曲.png',
        fullPage: true,
    });

    // 写入文件
    let writerStream = fs.createWriteStream('tmp/歌词.txt');
    writerStream.write(lyricCtn, 'UTF8');
    writerStream.end();

    // 获取评论数量
    const commentCount = await iframe.$eval('.sub.s-fc3', e => e.innerText);
    console.log(commentCount);

    // 获取评论
    const commentList = await iframe.$$eval('.itm', elements => {
        const ctn = elements.map(v => {
            return v.innerText.replace(/\s/g, '');
            window.scrollTo(0, 1000);
        });
        return ctn;
    });
    // console.log(commentList);
})();