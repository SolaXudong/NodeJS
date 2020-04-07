var fs = require('fs');
var path = './node_modules/_mysql@2.17.1@mysql';
var filearr = [];
fs.readdir(path, function (err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('所有文件: ', data);
    (function iterator(i) {
        if (i == data.length) {
            console.log('目录文件: ', filearr);
            return;
        }
        fs.stat(path + '/' + data[i], function (err2, data2) {
            if (err2) {
                console.log(err2);
                return;
            }
            if (data2.isDirectory()) {
                filearr.push(data[i]);
            }
            iterator(i + 1);
        });
    })(0);
});