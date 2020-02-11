var fs = require("fs");
exports.getAllAlbums = function(callback) {
	fs.readdir("./uploads", function(err1, files) {
		if (err1) {
			callback("没有找到uploads文件夹", null);
			return;
		}
		var allAlbums = [];
		(function iterator(i) {
			if (i == files.length) {
				console.log(allAlbums);
				callback(null, allAlbums);
				return;
			}
			fs.stat("./uploads/" + files[i], function(err2, stats) {
				if (err2) {
					callback("没有找到文件夹: " + files[i], null);
					return;
				}
				if (stats.isDirectory()) {
					allAlbums.push(files[i]);
				}
				iterator(i + 1);
			});
		})(0);
	});
}

// 通过文件名，得到所有图片
exports.getAllImagesByAlbumName = function(albumName, callback) {
	fs.readdir("./uploads/" + albumName, function(err1, files) {
		if (err1) {
			callback("没有找到文件: " + albumName, null);
			return;
		}
		var allImages = [];
		(function iterator(i) {
			if (i == files.length) {
				console.log(allImages);
				callback(null, allImages);
				return;
			}
			fs.stat("./uploads/" + albumName + "/" + files[i], function(err2, stats) {
				if (err2) {
					callback("没有找到文件: " + files[i], null);
					return;
				}
				if (stats.isFile()) {
					allImages.push(files[i]);
				}
				iterator(i + 1);
			});
		})(0);
	});
}
