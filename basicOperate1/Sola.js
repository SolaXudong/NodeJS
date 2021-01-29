/**
 * @tips 需求：读Excel -> 扫描文件夹 -> 匹配PDF和图片 -> 匹配文件拷贝到指定文件夹下 -> 添加MySQL
 * @tips 2021-01-28 22:45:24
 * @tips 安装依赖 >cnpm install xlsx-style mysql fse crypto
 * @tips 速度：文件名跟PDF和图片比较（一亿次/秒）
 */
const XLSX = require('xlsx-style');
const fs = require('fs');
const mysql = require('mysql');
const path = require("path");
const fse = require('fse');
const crypto = require('crypto');
const events = require('events');



console.log('##### 【任务开始】');
let _cost = new Date().getTime();
// 【准备】 
let _batch_no = '2021-01-29 04:49:42';
let _excelPath = 'D:/folder/还呗一期-造数据模板-100000.xlsx'; // 10/1000/10000/100000
let _targetPath = 'D:/folder/huanbei/'; // 复制到的新路径（格式：此目录下存放 huanbei001 huanbei002 文件夹，里面存放 用户身份证MD5 文件夹，里面存放PDF和图片）（如：huanbei001/xxx/xxx.pdf）
let _scanDirs = ['D:/folder/folder001/', 'D:/folder/folder002/' //
    , 'D:/java/workspace/NODEJS/NodeJS/basicOperate1/node_modules/' // 找一个文件多的文件夹，模拟测试，2千多个
]; // 要扫描的文件夹
let _perFolderContainFileNum = 100; // 每个文件夹放几个用户
var connection = mysql.createConnection({ // 数据库连接 // createPool/createConnection
    host: 'localhost',
    user: 'root',
    password: 'shijie',
    database: 'test'
});
let _step = 4; // 打印日志用
let cc = 0; // 打印日志用
let xx = 0; // 打印日志用
let totalCC = 0; // 打印日志用
// 【解析Excel】 
console.log('##### (1/%o)解析Excel开始', _step);
let _cost2 = new Date().getTime();
if (!fs.existsSync(_excelPath)) {
    console.log('##### 文件不存在，请检查文件路径：%o', _excelPath);
    return;
}
var workbook = XLSX.readFile(_excelPath);
const sheetNames = workbook.SheetNames; // 工作簿集合
const worksheet = workbook.Sheets[sheetNames[0]]; // 只处理第一个
let num = 1;
let arr = [];
for (let i = 1; i <= num; i++) {
    let r = worksheet['A' + i];
    if (r == null)
        break;
    if (r.v == '') { } else {
        let obj = {};
        obj['id'] = r.v; // 唯一标识
        obj['name'] = worksheet['B' + i].v; // 姓名
        obj['idno'] = worksheet['C' + i].v; // 身份证
        obj['product'] = worksheet['D' + i].v; // 产品
        obj['pdf'] = worksheet['E' + i].v; // PDF
        obj['jpg'] = worksheet['F' + i].v; // 图片
        arr.push(obj);
    }
    num++;
}
arr.shift(); // 去除第一条记录
console.log('##### (1/%o)解析Excel结束 cost : %o s', _step, (new Date().getTime() - _cost2) / 1000);
// 【整理表格数据】 
// 查总计需要遍历文件数（递归）
_scanDirs.forEach(function (filePath) {
    recursiveReadFile(filePath, null);
});
totalCC = cc;
cc = 0;
// 【扫描文件】 
console.log('##### (2/%o)扫描文件开始', _step);
_cost2 = new Date().getTime();
let _cost3 = new Date().getTime();
_scanDirs.forEach(function (filePath) {
    recursiveReadFile(filePath, arr);
});
console.log('##### (2/%o)扫描文件结束 cost : %o s', _step, (new Date().getTime() - _cost2) / 1000);
// console.log('##### 取前3条数据，检查一下');
// for (let i = 0; i < arr.length; i++) {
//     if (i < 3)
//         console.log('\t总数据量：%o/%o ：%o', (i + 1), arr.length, JSON.stringify(arr[i]));
// }
// 【拷贝文件】 
console.log('##### (3/%o)拷贝文件开始', _step);
_cost2 = new Date().getTime();
let _dirArr = _targetPath.split('/'); // 文件夹分组
_dirArr = _dirArr[_dirArr.length - 2];
let _maxNum = (arr.length % _perFolderContainFileNum == 0) ? (arr.length / _perFolderContainFileNum) : (arr.length / _perFolderContainFileNum + 1); // 总数据量 除 每组存放的用户数
_maxNum = parseInt(_maxNum).toFixed(0);
for (let i = 0; i < arr.length; i++) {
    let _idnoDir = crypto.createHash('md5').update(arr[i]['idno'], 'utf-8').digest('hex'); // 身份证MD5
    let _pdfArr = arr[i]['pdfArr'] ? arr[i]['pdfArr'] : []; // PDF
    let _jpgArr = arr[i]['jpgArr'] ? arr[i]['jpgArr'] : []; // 图片
    let _dirSequence = parseInt(i / _perFolderContainFileNum + 1).toFixed(0);
    let _newpdfArr = []; // PDF
    let _newjpgArr = []; // 图片
    _pdfArr.forEach((_t) => {
        let _arr = _t.split('/');
        let _newPath = _arr[_arr.length - 1];
        _newPath = _targetPath + _dirArr + _dirSequence + '/' + _idnoDir + '/' + _newPath;
        fse.copyFileSync(_t, _newPath);
        _newpdfArr.push(_newPath);
    });
    _jpgArr.forEach((_t) => {
        let _arr = _t.split('/');
        let _newPath = _arr[_arr.length - 1];
        _newPath = _targetPath + _dirArr + _dirSequence + '/' + _idnoDir + '/' + _newPath;
        fse.copyFileSync(_t, _newPath);
        _newjpgArr.push(_newPath);
    });
    arr[i]['newpdfArr'] = _newpdfArr;
    arr[i]['newjpgArr'] = _newjpgArr;
    if ((i + 1) % 10000 == 0 || i == arr.length - 1) {
        console.log('\t拷贝进度（用户数）：%o/%o cost : %o s', (i + 1), arr.length, (new Date().getTime() - _cost2) / 1000);
        _cost2 = new Date().getTime();
    }
}
console.log('##### (3/%o)拷贝文件结束 cost : %o s', _step, (new Date().getTime() - _cost2) / 1000);
// console.log('##### 取前3条数据，再检查一下');
// for (let i = 0; i < arr.length; i++) {
//     if (i < 3)
//         console.log('\t总数据量：%o/%o ：%o', (i + 1), arr.length, JSON.stringify(arr[i]));
// }
// 【存储MySQL】 
connection.connect();
console.log('##### (4/%o)存储MySQL开始', _step);
_cost2 = new Date().getTime();
/** 批量添加 */
let sql = `insert into user_file_info() values`;
let _tmpSql = '';
let _flag = true;
for (let i = 0; i < arr.length; i++) {
    let _obj = arr[i];
    let _arr1 = JSON.stringify({ 'pdfArr': _obj["pdfArr"] ? _obj["pdfArr"] : '[]' });
    let _arr2 = JSON.stringify({ 'newpdfArr': _obj["newpdfArr"] ? _obj["newpdfArr"] : '[]' });
    let _arr3 = JSON.stringify({ 'jpgArr': _obj["jpgArr"] ? _obj["jpgArr"] : '[]' });
    let _arr4 = JSON.stringify({ 'newjpgArr': _obj["newjpgArr"] ? _obj["newjpgArr"] : '[]' });
    if (_flag) {
        _tmpSql += `(null, '${_obj["id"]}', '${_batch_no}', '${_obj["product"]}', '${_obj["name"]}', '${_obj["idno"]}', '${_arr1}', '${_arr2}', '${_arr3}', '${_arr4}', sysdate())`;
        _flag = false;
    }
    else {
        _tmpSql += `,(null, '${_obj["id"]}', '${_batch_no}', '${_obj["product"]}', '${_obj["name"]}', '${_obj["idno"]}', '${_arr1}', '${_arr2}', '${_arr3}', '${_arr4}', sysdate())`;
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
                console.log('##### (4/%o)存储MySQL结束 cost : %o s', _step, (new Date().getTime() - _cost2) / 1000);
                console.log('##### 【任务结束】 cost : %o s', (new Date().getTime() - _cost) / 1000);
            }
        });
    }
}



/**
 * @tips 递归方法
 * @tips 代码参考：https://github.com/wenhandi/programmer/blob/main/nodeJs/keyWordSearch.js
 */
function recursiveReadFile(_dir, arr) {
    if (!fs.existsSync(_dir))
        return;
    if (fs.existsSync(_dir) && fs.statSync(_dir).isFile()) {
        // console.log('\t文件：', _dir);
        check(_dir, arr);
    } else if (fs.existsSync(_dir) && fs.statSync(_dir).isDirectory()) {
        // console.log('\t目录：', _dir);
        var files = fs.readdirSync(_dir);
        files.forEach(function (val) {
            var temp = path.join(_dir, val); // 不断拼接直到找到文件
            if (fs.existsSync(_dir) && fs.statSync(_dir).isDirectory()) {
                recursiveReadFile(temp, arr);
            } else if (fs.existsSync(_dir) && fs.statSync(_dir).isFile()) {
                check(temp, arr);
            }
        })
    }
}
/**
 * @tips 正则匹配文件名方法
 */
function check(_dir, arr) {
    cc++;
    if (!fs.existsSync(_dir))
        return;
    if (!arr)
        return;
    let _tmp = path.basename(_dir);
    for (let i = 0; i < arr.length; i++) {
        xx++;
        let _pdf = arr[i]['pdf'];
        let _jpg = arr[i]['jpg'];
        let _pdfArr = arr[i]['pdfArr'] ? arr[i]['pdfArr'] : [];
        let _jpgArr = arr[i]['jpgArr'] ? arr[i]['jpgArr'] : [];
        {
            if (_tmp.indexOf(_pdf) != -1) {
                // _tmp = path.normalize(_dir); // 用Window分隔符“\\”
                _tmp = path.normalize(_dir).replace(/\\/g, '/'); // 用Linux分隔符“/”
                _pdfArr.push(_tmp);
                arr[i]['pdfArr'] = _pdfArr; // 匹配到的PDF路径集合
            }
        }
        {
            if (_tmp.indexOf(_jpg) != -1) {
                _tmp = path.normalize(_dir).replace(/\\/g, '/'); // 用Linux分隔符“/”
                _jpgArr.push(_tmp);
                arr[i]['jpgArr'] = _jpgArr; // 匹配到的PDF路径集合
            }
        }
    }
    if (cc % 1000 == 0 || cc == totalCC) {
        console.log('\t扫描进度（文件数）：%o/%o，共比较次数：%o次，cost : %o s', cc, totalCC, xx, (new Date().getTime() - _cost3) / 1000);
        _cost3 = new Date().getTime();
    }
}