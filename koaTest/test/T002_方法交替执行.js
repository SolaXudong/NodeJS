/**
 * 一共10份工作
 */
async function test() {
    console.log('==================== 一共10份工作 ====================');
    let tt = new TT(10);
    let rs = await tt.t1(1);
    console.log('rs :', rs);
}

class TT {
    constructor(len) {
        this.len = len;
    }
    t1(data) {
        let _name = 'Boss';
        let _num = data;
        return new Promise((resolve, reject) => {
            if (_num < this.len) {
                setTimeout(() => {
                    console.log(new Date(), '-----', _name, _num);
                    if (_num % 2 != 0)
                        _num += 1;
                    resolve(_num);
                }, Math.random() * 500);
            } else {
                reject(_name + '，是最后一个');
            }
        }).then((_data) => {
            console.log('-----', _name, _data);
            if (_data % 2 == 0)
                this.t2(_data)
            else
                this.t1(_data);
        }).catch((_err) => {
            console.log('err -----', _name, '-----', _err);
        });
    }
    t2(data) {
        let _name = 'Worker';
        let _num = data;
        return new Promise((resolve, reject) => {
            if (_num < this.len) {
                setTimeout(() => {
                    console.log(new Date(), '-----', _name, _num);
                    if (_num % 2 == 0)
                        _num += 1;
                    resolve(_num);
                }, Math.random() * 500);
            } else {
                reject(_name + '，是最后一个');
            }
        }).then((_data) => {
            console.log('-----', _name, _data);
            if (_data % 2 == 0)
                this.t2(_data)
            else
                this.t1(_data);
        }).catch((_err) => {
            console.log('err -----', _name, '-----', _err);
        });
    }
}

test();