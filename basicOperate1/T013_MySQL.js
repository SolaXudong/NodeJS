var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shijie',
    database: 'test'
});
connection.connect();
let _cost = new Date().getTime();
let _total = 100000; // 1秒10万
/** 单个查询 */
// for (let index = 1; index <= _total; index++) {
//     var sql = `select * from user2 where id = ${index}`;
//     connection.query(sql, (error, results, fields) => {
//         if (error) throw error;
//         // console.log('result: ', JSON.parse(JSON.stringify(results[0])));
//         if (index % 10000 == 0 || index == _total)
//             console.log('##### over ', index, '/', _total, 'cost : ', (new Date().getTime() - _cost) / 1000, 's');
//     });
// }
/** 批量查询 */
// var sql = `select * from user2 where id in ( `;
// for (let index = 1; index <= _total; index++) {
//     if (index == 1)
//         sql += `${index}`;
//     else
//         sql += `,${index}`;
// }
// sql += ` )`;
// connection.query(sql, (error, results, fields) => {
//     if (error) throw error;
//     console.log('result: ', JSON.parse(JSON.stringify(results[results.length - 1])));
//     console.log('##### over cost : ', (new Date().getTime() - _cost) / 1000, 's');
// });
/** 单个添加 */
// for (let index = 1; index <= _total; index++) {
//     // var sql = `SELECT * FROM user2 limit 3`;
//     var sql = `insert into user2() values(null, '徐${index}', ${index}, sysdate())`;
//     connection.query(sql, (error, results, fields) => {
//         if (error) throw error;
//         // console.log('result: ', results);
//         if (index % 10000 == 0 || index == _total)
//             console.log('##### over ', index, '/', _total, 'cost : ', (new Date().getTime() - _cost) / 1000, 's');
//     });
// }
/** 批量添加 */
// var sql = `insert into user2() values`;
// for (let index = 1; index <= _total; index++) {
//     if (index == 1)
//         sql += `(null, '徐${index}', ${index}, now())`;
//     else
//         sql += `,(null, '徐${index}', ${index}, now())`;
// }
// connection.query(sql, (error, results, fields) => {
//     if (error) throw error;
//     // console.log('result: ', results);
//     console.log('##### over cost : ', (new Date().getTime() - _cost) / 1000, 's');
// });
connection.end();