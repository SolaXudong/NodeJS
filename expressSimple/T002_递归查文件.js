var http = require("http");
var url = require("url");
var fs = require("fs");

var server = http.createServer(function(req, res) {
	if(req.url=="/favicon.ico"){
		return;
	}
	// 遍历里面的所有文件、文件夹
	fs.readdir("./pic/", function(err1, files){
		// 存放文件夹的数组
		var fileArr = [];
		// 迭代器就是强行把异步的函数，变成同步的函数
		// 1做完了，再做2；2做完了，再做3
		(function iterator(i){
			// 遍历结束
			if(i==files.length){
				console.log(fileArr);
				return;
			}
			fs.stat("./pic/"+files[i], function(err2, file){
				// 检测成功之后做的事情
				// if(file.isDirectory()){
				if(file.isFile()){
					// 如果是文件夹，那么放入数组。不是，什么也不做
					fileArr.push(files[i]);
				}
				iterator(i+1);
			});
		})(0);
	});
	res.end();
});
server.listen(3000, "localhost");
