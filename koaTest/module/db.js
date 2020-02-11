var Config = require('./config.js');
var mysql = require('mysql');

class DB {
    // 单例（解决：多次实例化实例不共享的问题）
    static getInstance() {
        if (!DB.instance)
            DB.instance = new DB();
        return DB.instance;
    }
    constructor() {
        // console.log('database constructor...');
        this.dbClient = ''; // 属性，存放db对象
        this.connect(); // 实例化的时候就连接数据库
    }
    connect() {
        let _time = parseInt(Math.random() * 1);
        let _tid = 'db-' + parseInt(Math.random() * 1000) + '-' + parseInt(Math.random() * 1000) + '-' + _time;
        console.time(_tid);
        let _that = this;
        return new Promise((resolve, reject) => {
            if (!_that.dbClient) {
                console.log('database connect init...');
                setTimeout(() => {
                    _that.dbClient = mysql.createConnection(
                        // {
                        //     host: Config.MYSQL_HOST,
                        //     user: Config.MYSQL_USER,
                        //     password: Config.MYSQL_PWD,
                        //     database: Config.MYSQL_DABASE
                        // }
                        Config.MYSQL_URL
                    );
                    _that.dbClient.connect();
                    resolve(_that.dbClient);
                    console.timeEnd(_tid);
                }, 200);
            } else {
                resolve(_that.dbClient);
                console.timeEnd(_tid);
            }
        });
    }
    find(sql) {
        let _that = this;
        return new Promise((resolve, reject) => {
            _that.connect().then((db) => {
                // var sql = 'SELECT count(1) FROM user';
                // var sql = 'insert into user(name) values(2)';
                _that.dbClient.query(sql, (error, results, fields) => {
                    if (error) throw error;
                    // console.log('result: ', results);
                    // connection.end();
                    resolve(results);
                });
            });
        });
    }
}

module.exports = DB.getInstance();