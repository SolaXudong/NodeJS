var fs = require('fs');

var picurl = './tmp/05.png';
var ran = parseInt(Math.random() * 100 + 100);
var newpicurl = './tmp/05_' + ran + '.png';
var readStream = fs.createReadStream(picurl);
var writeStream = fs.createWriteStream(newpicurl);

readStream.pipe(writeStream);
