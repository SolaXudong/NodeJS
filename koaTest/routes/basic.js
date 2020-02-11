var router = require('koa-router')();
var DB = require('../module/db.js');

// router.prefix('/');
// ======================================== 【自定义路由】 ========================================
router.get('/', async(ctx, next) => {
    let dd = await DB.find('select id,name,age from user');
    console.log('DB.find(): ', dd);
    ctx.body = 'Hello Koa';
    // ctx.redirect('/');
}).get('/t1', async(ctx, next) => { // 接参数
    // 在koa2中GET传值通过request接收，两种方式：query和querystring，返回格式化好的参数对象，返回请求字符串
    console.log('ctx.query: ', ctx.query);
    console.log('ctx.querystring: ', ctx.querystring);
    ctx.body = 't1';
}).get('/t2/:aid/:bid', async(ctx, next) => { // 动态路由（里面可以传入多个值）
    // 获取动态路由的传值
    console.log('获取动态路由的传值: ', ctx.params);
    ctx.body = 't2';
}).get('/t3', async(ctx, next) => { // 多个路由传递
    console.log('t3-1');
    await next();
}).get('/t3', async(ctx, next) => { // 测试Cookie和Session
    console.log('t3-2');
    var _cookie = ctx.cookies.get('curU');
    var _session = ctx.session.curUser;
    if (_cookie)
        console.log('get cookie: ', Buffer.from(_cookie, 'base64').toString());
    if (_session)
        console.log('get session: ', _session);
    ctx.body = 't3';
}).get('/t4', async(ctx, next) => { // 渲染页面
    console.log('/t4');
    var news = ['新闻一', '新闻二', '新闻三'];
    var content = '<h2>这是一个h2</h2>';
    await ctx.render('index', {
        news,
        content
    });
}).get('/t5', async(ctx, next) => { // 渲染页面（测试公共数据）（表单页面）
    console.log('t5');
    console.log('__dirname: ', __dirname);
    console.log('__filename: ', __filename);
    await ctx.render('form');
}).post('/t6', async(ctx, next) => { // 获取表单数据
    console.log('t6');
    // 原生NodeJS在Koa中获取表单提交的数据
    // var data = await common.getFormData(ctx);
    // Koa中bodyparser获取表单提交的数据
    var data = ctx.request.body;
    ctx.body = data;
});

module.exports = router.routes();