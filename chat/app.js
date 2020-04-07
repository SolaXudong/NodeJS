var express = require("express");
var app = express();
// socket.io公式
var http = require("http").Server(app);
var io = require("socket.io")(http);
// session公式
var session = require("express-session");
// 使用session
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
}));

// 模板引擎
app.set("view engine", "ejs");
// 静态服务
app.use(express.static("./public"));

var alluser = [];

// 中间件
// 显示首页
app.get("/", function(req, res, next) {
    // 使用cookie：写入cookie；获取使用cookie-parser，使用中间件之后，通过req.cookies使用
    res.cookie('user', 'blue', { path: '/', maxAge: 30 * 24 * 3600 * 1000 });
    res.render("index");
});
// 确认登录，检查此人是否有用户名，并且昵称不能重复
app.get("/login", function(req, res, next) {
    var uname = req.query.uname;
    if (!uname) {
        res.send("必须填写用户名");
        return;
    }
    if (alluser.indexOf(uname) != -1) {
        res.send("用户名已经被占用");
        return;
    }
    alluser.push(uname);
    // 赋给session
    req.session.uname = uname;
    res.redirect("/chat");
});
// 聊天室
app.get("/chat", function(req, res, next) {
    // 这个页面 必须保证有用户名了
    if (!req.session.uname) {
        res.redirect("/");
        return;
    }
    res.render("chat", {
        "uname": req.session.uname
    });
});

io.on('connection', function(socket) {
    socket.on("topic", function(msg) {
        console.log(msg);
        // 把接收到的msg原样广播
        io.emit('topic', msg);
    });
});

// 监听
http.listen(3000);