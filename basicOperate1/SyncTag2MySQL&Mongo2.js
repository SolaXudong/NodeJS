const XLSX = require('xlsx-style');
const fs = require('fs');
const path = require("path");
const mysql = require('mysql');
const mongoclient = require("mongodb");

console.log('##### 【任务开始】');
let _cost = new Date().getTime();
let _excelPath = 'D:/tt/IVR.xlsx'; // IVR/ROBOT
let _tag = path.basename(_excelPath, '.xlsx');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shijie',
    database: 'debt_test_new'
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
    // console.log('\t总数据量：%o/%o ：%o', (i + 1), arr.length, JSON.stringify(arr[i]));
}
if (arr.length == 0)
    console.log('##### 没有可用数据：%o', arr.length);
// 【存储MySQL】 
connection.connect();
console.log('##### (2)存储MySQL开始');
_cost2 = new Date().getTime();
let _count1 = 0;
let _count2 = 0;
updateMySQL(_count1, arr);
function updateMySQL(_count1, arr) {
    if (_count1 == arr.length)
        return;
    // 准备对象
    let _obj = arr[_count1];
    _obj['robotTag'] = '';
    _obj['ivrTag'] = '';
    if (_obj['tagType'] == 1)
        _obj['robotTag'] = _obj['tag'];
    else if (_obj['tagType'] == 2)
        _obj['ivrTag'] = _obj['tag'];
    // 拼SQL
    let _countSql = `select count(1) cc from c_voice_call_tag where case_no = '${_obj['caseNo']}'`;
    connection.query(_countSql, (error, results, fields) => {
        // console.log('\tselect：', _countSql, results[0].cc);
        let _tmpSql = ``;
        if (results && results[0].cc == 0) {
            _tmpSql = `insert into c_voice_call_tag () values ( null, '${_obj['caseNo']}', 1, '${_obj['robotTag']}', '${_obj['ivrTag']}', 0, sysdate(), sysdate() )`;
        } else {
            if (_obj['tagType'] == 1)
                _tmpSql = `update c_voice_call_tag set robot_tag = '${_obj['robotTag']}' where case_no = '${_obj['caseNo']}'`;
            else if (_obj['tagType'] == 2)
                _tmpSql = `update c_voice_call_tag set ivr_tag = '${_obj['ivrTag']}' where case_no = '${_obj['caseNo']}'`;
        }
        connection.query(_tmpSql, (error2, results2, fields2) => {
            // console.log('\tinsert/update：', _tmpSql);
            if ((_count1 + 1) % 100 == 0 || _count1 == arr.length - 1) {
                console.log('\t处理进度（案件数）：%o/%o cost : ', (_count1 + 1), arr.length, (new Date().getTime() - _cost2) / 1000, 's');
                _cost2 = new Date().getTime();
                if (_count1 == arr.length - 1) {
                    connection.end();
                    console.log('##### (2)存储MySQL结束 cost : %o s', (new Date().getTime() - _cost2) / 1000);
                    console.log('##### (3)同步Mongo开始');
                    _cost2 = new Date().getTime();
                    console.log('##### (3)同步Mongo结束 cost : %o s', (new Date().getTime() - _cost2) / 1000);
                    console.log('##### 【任务结束】 cost : %o s', (new Date().getTime() - _cost) / 1000);
                }
            }
            if (_count1 < arr.length)
                updateMySQL(++_count1, arr);
        });
    });
}
updateMongo(_count2, arr);
function updateMongo(_count2, arr) {
    if (_count2 == arr.length)
        return;
    // 准备对象
    let _updateObj = {};
    let _obj = arr[_count2];
    if (_obj['tagType'] == 1)
        _updateObj['robot_tag'] = _obj['tag'];
    else if (_obj['tagType'] == 2)
        _updateObj['ivr_tag'] = _obj['tag'];
    mongoclient.connect("mongodb://debt_test:o4GtROXZF9tXdzJq@47.110.135.139:9717/debt_test_new", { useUnifiedTopology: true }, function (err, client) {
        client.db("debt_test_new").collection("t_case_info").updateMany({ case_no: _obj['caseNo'] }, { $set: _updateObj }, { multi: true }).then(function (result) {
            // console.log('\tmongo：', _count2);
            client.close();
            if (_count2 < arr.length)
                updateMongo(++_count2, arr);
        }, function (err) {
            console.log(err.message);
        });
    });
}