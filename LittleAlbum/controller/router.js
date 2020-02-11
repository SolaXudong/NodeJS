var file = require("../models/file.js");
var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var sd = require('silly-datetime');
// 首页
exports.showIndex = function(req, res, next) {
	console.log("首页");
	// res.send("首页");
	// 	res.render("index", {
	// 		"albums": file.getAllAlbums()
	// 	});
	file.getAllAlbums(function(err, allAlbums) {
		if (err) {
			next(); // 交给下面的中间件
			return;
		}
		res.render("index", {
			"albums": allAlbums
		});
	});
}
// 相册页
exports.showAlbum = function(req, res, next) {
	console.log("相册页");
	// res.send("相册: " + req.params.albumName);
	// 遍历相册中的所有图片
	var albumName = req.params.albumName;
	// 具体业务交给model
	file.getAllImagesByAlbumName(albumName, function(err, imagesArray) {
		if (err) {
			next(); // 交给下面的中间件
			return;
		}
		res.render("album", {
			"albumname": albumName,
			"images": imagesArray
		});
	});
}
// 显示上传
exports.showUp = function(req, res) {
	console.log("显示上传");
	// 	res.render("up", {
	// 		albums: ["我", "的", "一", "个"]
	// 	});
	file.getAllAlbums(function(err, allAlbums) {
		if (err) {
			return;
		}
		res.render("up", {
			albums: allAlbums
		});
	});
}
// 上传表单 formidable
exports.doPost = function(req, res) {
	console.log("上传表单");
	var form = new formidable.IncomingForm();
	form.uploadDir = path.normalize(__dirname + "/../tempup/");
	form.parse(req, function(err1, fields, files, next) {
		console.log("fields: ", fields);
		console.log("files: ", files);
		// 改名
		if (err1) {
			// 这个中间件不受理这个请求了，往下走
			next();
			return;
		}
		// 判断文件尺寸
		var size = parseInt(files.tupian.size);
		if (size > 2000) {
			res.send("图片尺寸应该小于1M");
			// 删除图片
			fs.unlink(files.tupian.path);
			return;
		}

		var ttt = sd.format(new Date(), 'YYYYMMDDHHmmss');
		var ran = parseInt(Math.random() * 89999 + 10000);
		var extname = path.extname(files.tupian.name);

		var wenjianjia = fields.wenjianjia;
		var oldPath = files.tupian.path;
		var newPath = path.normalize(__dirname + "/../uploads/" + wenjianjia + "/" + ttt + ran + extname);
		console.log("oldPath: ", oldPath);
		console.log("newPath: ", newPath);
		fs.rename(oldPath, newPath, function(err2) {
			if (err2) {
				res.send("改名失败");
				return;
			}
			res.send("成功");
		});
	});
}
