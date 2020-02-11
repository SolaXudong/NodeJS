// ======================================== 【引入模块】 ========================================
const Koa = require('koa');
// 实例化
const app = new Koa();
var router = require('koa-router')();
var static = require('koa-static');
var views = require('koa-views');
var session = require('koa-session');
// other modules
var sd = require('silly-datetime');
const chalk = require('chalk');
var bodyparser = require('koa-bodyparser');
var common = require('./module/common.js');
// 引入子模块

// ======================================== 【中间件】，匹配所有路由 ========================================
app.use(async(ctx, next) => {
    console.log(chalk.bgBlack.red('【', sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'), '】', '【', ctx.url, '】'));
    // 公共的数据放在这个里面，这样的话在模板的任何地方都可以使用（注：放在中间件）
    ctx.state = {
        session: this.session,
        title: 'public data'
    };
    var curU = JSON.stringify({ 'name': '徐东', age: 28 });
    // cookie（解决不能存中文：Buffer、encodeURI和decodeURI）
    // 先转换成base64字符串，再还原base64字符串
    // console.log('set cookie: ', curU, Buffer.from(curU).toString('base64'));
    ctx.cookies.set('curU', Buffer.from(curU).toString('base64'), {
        maxAge: 60 * 1000
    });
    // session
    ctx.session.curUser = curU;
    await next();
    if (ctx.status == 404) {
        ctx.status == 404;
        ctx.body = '404';
    }
    // console.log('1.check url');
}).use(async(ctx, next) => {
    // console.log('2.start...');
    // 当前路由匹配完成以后继续向下匹配
    await next();
    // console.log('2.start');
});
// 第三方中间件（配置模板引擎中间件）
// app.use(views(__dirname + '/views', { map: { html: 'ejs' } }));
app.use(views('views', { extension: 'ejs' }));
// 配置post bodyparser的中间件
app.use(bodyparser());
// 静态资源中间件，静态web服务（首先去static目录找，如果能找到返回对应的文件，找不到next()）
app.use(static(__dirname + '/static'));
app.use(static(__dirname + '/public')); // Koa静态资源中间件可以配置多个
// 配置session中间件
app.keys = ['some secret hurr']; // cookie的签名
const CONFIG = {
    key: 'koa:sess', // cookie key（default is koa:sess）
    maxAge: 86400000, // * cookie的过期时间（默认一天）
    overwrite: true, // 是否可以overwrite（默认 default true）
    httpOnly: true, // cookie是否只有服务器端可以访问（default true）
    signed: true, // 签名（default true）
    rolling: true, // （每次请求时重新设置一次）在每次请求时强行设置cookie，这将重置cookie过期时间（default false）
    renew: false // * （快过期时重新设置一次，让用户每次操作如果快过期重置下时间）renew session when session is nearly expired（default false）
};
app.use(session(CONFIG, app));

// ======================================== 【启动路由】 ========================================
// 配置子路由（层级路由，路由模块化）
// router.use('/', require('./routes/admin.js'));
router.use(require('./routes/admin.js')); // 两个地方规定好就行，不要重复
router.use('/t', require('./routes/basic.js'));
router.use('/user', require('./routes/admin/user.js'));
router.use('/news', require('./routes/admin/news.js'));
// 建议配置，作用：这是官方文档的推荐用法，用在了路由匹配router.routes()之后，所以在当所有路由中间件最后调用，此时根据ctx.status设置response响应头
app.use(router.routes()).use(router.allowedMethods());
// 监听端口
app.listen(3000, () => {
    console.log('==================== starting at port 3000 ====================');
});