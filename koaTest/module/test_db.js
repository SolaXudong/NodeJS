var DB = require('./db.js');

let sql = 'select id, name, age from user';
var p = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('==================== start ====================');
    }, 200);
});
p.then((data) => {
    console.log(data);
    for (let index = 0; index < 25; index++) {
        setTimeout(() => {
            let _tid = 'test-' + parseInt(Math.random() * 1000) + '-' + parseInt(Math.random() * 1000);
            console.time(_tid);
            // sql = `insert into user(name) values('${index+1000}')`;
            DB.find(sql).then((data) => {
                console.timeEnd(_tid);
            });
        }, Math.random());
    }
});