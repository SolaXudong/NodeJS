var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shijie',
    database: 'test'
});
connection.connect();
let _cost = new Date().getTime();
let _total = 1000; // 1秒10万
/** 单个添加 */
// for (let index = 1; index <= _total; index++) {
//     // var sql = `SELECT * FROM user2 limit 3`;
//     var sql = `insert into user2() values(null, '徐${index}', ${index}, sysdate())`;
//     connection.query(sql, (error, results, fields) => {
//         if (error) throw error;
//         // console.log('result: ', results);
//         if (index % _total == 0 || index == _total)
//             console.log('##### over ', index, '/', _total, 'cost : ', (new Date().getTime() - _cost) / 1000, 's');
//     });
// }
/** 批量添加 */
var sql = `insert into user2() values`;
for (let index = 1; index <= _total; index++) {
    if (index == 1)
        sql += `(null, '徐${index}', ${index}, now())`;
    else
        sql += `,(null, '徐${index}', ${index}, now())`;
}
connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    // console.log('result: ', results);
    console.log('##### over cost : ', (new Date().getTime() - _cost) / 1000, 's');
});
connection.end();