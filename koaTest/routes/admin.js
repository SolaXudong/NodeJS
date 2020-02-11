var router = require('koa-router')();

// 注意：前台后台匹配路由的写法不一样
router.get('/', async(ctx, next) => {
    console.log('/');
    await ctx.render('default/index');
}).get('/case', async(ctx, next) => {
    console.log('/case');
    await ctx.render('default/case');
}).get('/about', async(ctx, next) => {
    console.log('/about');
    await ctx.render('default/about');
});

module.exports = router.routes();