var router = require('koa-router')();

router.get('', async(ctx, next) => {
    console.log('news');
    await ctx.render('admin/news/index', {});
}).get('/list', async(ctx, next) => {
    console.log('news list');
    await ctx.render('admin/news/index', {});
}).get('/add', async(ctx, next) => {
    console.log('news add');
    await ctx.render('admin/news/add', {});
});

module.exports = router.routes();