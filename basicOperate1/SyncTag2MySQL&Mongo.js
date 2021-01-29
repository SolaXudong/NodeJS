const XLSX = require('xlsx-style');
const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const mongoclient = require("mongodb");

console.log('##### 【任务开始】');
let _cost = new Date().getTime();
let _excelPath = 'D:/tt/IVR.xlsx';
let _tag = path.basename(_excelPath, '.xlsx');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shijie',
    database: 'test'
});
// 【解析Excel】 
console.log('##### (1)解析Excel开始');
let _cost2 = new Date().getTime();
if (!fs.existsSync(_excelPath)) {
    console.log('##### 文件不存在，请检查文件路径：%o', _excelPath);
    return;
}
var workbook = XLSX.readFile(_excelPath);
const sheetNames = workbook.SheetNames;
let arr = [];
for (let i = 0; i < sheetNames.length; i++) {
    const worksheet = workbook.Sheets[sheetNames[i]];
    let num = 1;
    for (let k = 1; k <= num; k++) {
        num++;
        let r = worksheet['A' + k];
        if (r == null)
            break;
        if ((r.v + '').indexOf('-') > -1) {
            if (r.v != '') {
                let obj = {};
                obj['caseNo'] = r.v; // 案件ID
                obj['tag'] = worksheet['B' + k].v; // Tag标签
                obj['tagType'] = (_tag == 'ROBOT') ? 1 : ((_tag == 'IVR') ? 2 : 3) // 标签类型
                arr.push(obj);
            }
        }
    }
}
// arr.shift(); // 去除第一条记录
console.log('##### (1)解析Excel结束 cost : %o s', (new Date().getTime() - _cost2) / 1000);
for (let i = 0; i < arr.length; i++) {
    // if (i < 3)
    console.log('\t总数据量：%o/%o ：%o', (i + 1), arr.length, JSON.stringify(arr[i]));
}
// 【存储MySQL】 
connection.connect();
console.log('##### (2)存储MySQL开始');
_cost2 = new Date().getTime();
let sql = `insert into c_voice_call_tag() values`;
let _tmpSql = '';
let _flag = true;
for (let i = 0; i < arr.length; i++) {
    let _obj = arr[i];
    if (_obj['tagType'] == 1)
        _obj['robotTag'] = '';
    else
        _obj['ivrTag'] = '';
    if (_flag) {
        _tmpSql += `( null, ${_obj['caseNo']}, 1, ${_obj['caseNo']}, ${_obj['caseNo']}, 0, sysdate(), sysdate() )`;
        _flag = false;
    }
    else {
        _tmpSql += `,()`;
    }
    if ((i + 1) % 10000 == 0 || i == arr.length - 1) {
        let _tmpSql2 = _tmpSql;
        _tmpSql = '';
        _flag = true;
        connection.query(sql + _tmpSql2, (error, results, fields) => {
            if (error) throw error;
            console.log('\t添加进度（用户数）：%o/%o cost : ', (i + 1), arr.length, (new Date().getTime() - _cost2) / 1000, 's');
            _cost2 = new Date().getTime();
            if (i == arr.length - 1) {
                connection.end();
                console.log('##### (2)存储MySQL结束 cost : %o s', (new Date().getTime() - _cost2) / 1000);
                console.log('##### (3)同步Mongo开始');
                _cost2 = new Date().getTime();
                console.log('##### (3)同步Mongo结束 cost : %o s', (new Date().getTime() - _cost2) / 1000);
                console.log('##### 【任务结束】 cost : %o s', (new Date().getTime() - _cost) / 1000);
            }
        });
    }
}