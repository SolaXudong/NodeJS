var fs = require("fs");

var str = '';
for (var i = 0; i < 50_0; i++) {
    str += '我是从数据库获取的数据，我要保存起来\n';
}

var writeStream = fs.createWriteStream('./tmp/T007_writestream.txt');
// 异步方法
writeStream.write(str);

// 如果要监听写入完成，需要先标记写入完成，再监听
writeStream.end();
writeStream.on('finish', () => {
    console.log('写入完成');
});