var fs = require("fs");
var readStream = fs.createReadStream('./T005_es6.js');

var count = 0;
var str = '';
readStream.on('data', (data) => {
    str += data;
    count++;
});
readStream.on('end', () => {
    console.log(`count: ${count}`);
    console.log(`str: ${str}`);
});
readStream.on('error', (err) => {
    console.log(`err: ${err}`);
});