/**
 * 一共10份工作，第3份是重要的
 */
async function test() {
    console.log('==================== 一共10份工作，第3份是重要的 ====================');
    let tt = new TT(10, 3);
    let rs = await tt.t2(1);
    console.log('rs :', rs);
}

class TT {
    constructor(len, spe) {
        this.len = len;
        this.spe = spe;
    }
    t1(data) {
        let _name = 'Boss';
        let _num = data;
        return new Promise((resolve, reject) => {
            if (_num < this.len) {
                setTimeout(() => {
                    console.log(new Date(), '-----', _name, _num);
                    _num += 1;
                    resolve(_num);
                }, Math.random() * 500);
            } else {
                reject(_name + '，是最后一个');
            }
        }).then((_data) => {
            console.log('-----', _name, _data);
            this.t2(_data)
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
                    if (_num != this.spe)
                        _num += 1;
                    resolve(_num);
                }, Math.random() * 500);
            } else {
                reject(_name + '，是最后一个');
            }
        }).then((_data) => {
            console.log('-----', _name, _data);
            if (_data == this.spe)
                this.t1(_data);
            else
                this.t2(_data)
        }).catch((_err) => {
            console.log('err -----', _name, '-----', _err);
        });
    }
}

test();