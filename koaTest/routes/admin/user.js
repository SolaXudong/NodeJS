var router = require('koa-router')();
var DB = require('../../module/db.js');
var Result = require('../../module/Result.js');
var Constant = require('../../module/Constant.js');

router.get('/', async(ctx, next) => {
    console.log('user');
    await ctx.render('admin/user/index', {});
}).get('/list', async(ctx, next) => {
    console.log('user list');
    let rs = await DB.find('select * from user');
    let count = await DB.find('select count(1) from user');
    // console.log('rs :', count[0]['count(1)'], JSON.parse(JSON.stringify(rs)));
    let list = {
        total: count[0]['count(1)'],
        data: JSON.parse(JSON.stringify(rs))
    };
    ctx.body = list;
}).put('/add', async(ctx, next) => {
    var data = ctx.request.body;
    console.log('user add', data);
    let rs = await DB.find(`insert into user(name,age,birth) values('${data.username}', ${data.userage}, '${data.userbirth}')`);
    console.log('rs :', rs);
    let result = await Result.success(Constant.MSG_SUCCESS, '添加成功', {});
    console.log('result :', result);
    ctx.body = result;
}).post('/update', async(ctx, next) => {
    var data = ctx.request.body;
    console.log('user update', data);
    let rs = await DB.find(`update user set name = '${data.username}', age = ${data.userage}, birth = '${data.userbirth}' where id = ${data.userid}`);
    console.log('rs :', rs);
    let result = await Result.success(Constant.MSG_SUCCESS, '修改成功', {});
    console.log('result :', result);
    ctx.body = result;
}).get('/delete', async(ctx, next) => {
    console.log('user delete', ctx.query, ctx.query.userid);
    let userid = ctx.query.userid;
    let rs = await DB.find(`delete from user where id = ${userid}`);
    console.log('rs :', rs);
    let result = await Result.success(Constant.MSG_SUCCESS, '删除成功', {});
    console.log('result :', result);
    ctx.body = result;
});

module.exports = router.routes();