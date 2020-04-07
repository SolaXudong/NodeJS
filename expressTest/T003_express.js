// 返回一个函数
var express = require("express");
var app = express();

// 路由
app.get("/", function(req, res) {
	res.send("你好");
});
app.get("/t1", function(req, res, next) {
	console.log("t1");
	res.send("你好，t1");
	// next();
});
app.get("/t1", function(req, res) {
	console.log("t11");
	res.send("你好，t11");
});
app.get(/^\/t2\/([\d]{3})$/, function(req, res) {
	// 正则中的()是参数
	res.send("你好，t2-1: " + req.params[0]);
});
app.get("/t3/:id/:name", function(req, res) {
	var id = req.params["id"];
	var name = req.params["name"];
	var reg = /^[\d]{3}$/;
	if (reg.test(id)) {
		res.send("你好，t3，OK: " + id + "\t" + name);
	} else {
		res.send("请检查格式: " + id + "\t" + name);
	}
});
app.get("/t4", function(req, res) {
	res.render("template1", {
		"news": ["新闻一", "新闻二", "新闻三"]
	});
});
// GET请求的参数在URL中，在原生Node中，需要使用url模块来识别参数字符串。在Express中，不需要使用url模块了。可以直接使用req.query对象
app.get("/t5", function(req, res) {
	console.log("req.query: ", req.query);
	res.send("t5");
});
// POST请求在express中不能直接获得，必须使用body-parser模块。使用后，将可以用req.body得到参数。但是如果表单中含有文件上传，那么还是需要使用formidable模块

// 静态文件
app.use(express.static("./public"));

// 模板引擎
app.set("view engine", "ejs");
// 设置自定义文件夹
// app.set("views", "a");

app.listen(3000);
