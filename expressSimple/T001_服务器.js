// 这个案例简单讲解http模块
// 引用模块
var http = require("http");
var url = require("url");

// 创建一个服务器，回调函数表示接收到请求之后做的事情
var server = http.createServer(function (req, res) {
    // req参数表示请求，res表示响应
    console.log("请求路径: ", req.url);
    console.log("url: ", url.parse(req.url));
    console.log("pathname: ", url.parse(req.url).pathname);
    // 设置一个返应头
    // res.setHeader("Content-Type", "text/html;charset-UTF8");
    res.writeHead(200, {
        "Content-Type": "text/html;charset=UTF-8"
    });
    res.write("<h1>我是1标题</h1>");
    res.write("<h2>我是2标题</h2>");
    res.end("hello...");
    // res.end();
});
// 监听端口
server.listen(3000, "localhost");
