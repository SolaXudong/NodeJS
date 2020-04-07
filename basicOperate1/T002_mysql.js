var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shijie',
    database: 'test'
});
connection.connect();
var sql = 'SELECT * FROM user';
// sql = 'insert into user(id) values(2)';
connection.query(sql, (error, results, fields) => {
    if (error) throw error;
    console.log('result: ', results);
});
connection.end();