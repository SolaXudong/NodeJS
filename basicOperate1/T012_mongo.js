// 代码参考：https://www.cnblogs.com/zp900704/p/11688041.html
const mongoclient = require("mongodb");
mongoclient.connect("mongodb://debt_test:o4GtROXZF9tXdzJq@47.110.135.139:9717/debt_test_new", { useUnifiedTopology: true }, function (err, client) {
    let _total = 10000;
    let _cost = new Date().getTime();
    for (let index = 1; index <= _total; index++) {
        client.db("debt_test_new").collection("user").updateMany({ name: "徐_1" }, { $set: { age: 100, name: "徐_1" } }, { multi: true }).then(function (result) {
            // console.log(result.result);
            if (index == _total)
                console.log('##### over cost : ', (new Date().getTime() - _cost) / 1000, 's');
        }, function (err) {
            console.log(err.message);
        })
    }
});