// npmjs.com -> js-xlsx
// npm install xlsx-style

// 打开Excel文件，返回 workbook
const XLSX = require('xlsx-style');
const fs = require('fs');
const chalk = require('chalk');

console.log(chalk.bgBlack.red('start...'));
let fname = __dirname;
fs.readdir(fname, (err, fd) => {
    if (err) {
        console.log('读取目录失败');
        throw err;
    }
    for (let k = 0; k < fd.length; k++) {
        if (fd[k].indexOf('.xlsx') > 0 && fd[k].indexOf('~') == -1) {
            const workbook = XLSX.readFile(fd[k], {
                cellStyles: true,
                bookFiles: true
            });
            // 获取 Excel 中所有表名
            const sheetNames = workbook.SheetNames;
            // 根据表名获取对应某张表
            const worksheet = workbook.Sheets[sheetNames[0]];
            // 获取 A1 单元格对象
            // let a1 = worksheet['A1'];
            // 获取 A1 中的值
            // a1.v // 返回真实值2
            let num = 1;
            let arr = [];
            let vilage = '';
            for (let i = 1; i <= num; i++) {
                let r = worksheet['A' + i];
                if (r == null) {
                    break;
                }
                if (r.v == '' || r.v == 'ID') {} else {
                    let obj = {};
                    if (worksheet['B' + i].v == '') {
                        vilage = worksheet['A' + i].v;
                    } else {
                        obj['id'] = r.v;
                        obj['name'] = worksheet['B' + i].v;
                        obj['vilage'] = vilage;
                        obj['cun'] = worksheet['C' + i].v;
                        obj['phone'] = worksheet['D' + i].v;
                        let darr = [];
                        let dobj = {};
                        if (worksheet['E' + i].v != '') {
                            dobj['亩数'] = worksheet['E' + i].v;
                        }
                        if (worksheet['F' + i].v != '') {
                            dobj['面积'] = worksheet['F' + i].v;
                        }
                        if (JSON.stringify(dobj) != '{}') {
                            darr.push(dobj);
                        }
                        dobj = {};
                        if (worksheet['G' + i].v != '') {
                            dobj['亩数'] = worksheet['G' + i].v;
                        }
                        if (worksheet['H' + i].v != '') {
                            dobj['面积'] = worksheet['H' + i].v;
                        }
                        if (JSON.stringify(dobj) != '{}') {
                            darr.push(dobj);
                        }
                        if (JSON.stringify(darr) != '[]') {
                            obj['detail'] = JSON.stringify(darr);
                        } else {
                            obj['detail'] = '';
                        }
                        arr.push(obj);
                    }
                }
                num++;
            }
            // console.log(arr);
            let target = './' + fd[k].split('.')[0] + '.sql';
            var out = fs.createWriteStream(target);
            for (let i = 0; i < arr.length; i++) {
                let detail = '';
                if (JSON.stringify(arr[i].detail) != '""') {
                    detail = JSON.stringify(arr[i].detail);
                    detail = detail.substring(1, detail.length - 1);
                    detail = detail.replace(/\\/g, '');
                }
                let sql = 'insert into xxx(id,name,age) values(' +
                    arr[i].id +
                    ',\'' + arr[i].name + '\'' +
                    ',\'' + arr[i].vilage + '\'' +
                    ',\'' + arr[i].cun + '\'' +
                    ',\'' + arr[i].phone + '\'' +
                    ',\'' + detail + '\'' +
                    ');\r\n';
                out.write(sql);
            }
        }
    }
});
console.log(chalk.bgBlack.red('end...'));
