class Result {
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
    }
    static success(code, msg, data) {
        return new Promise((resolve, reject) => {
            // console.log(`${code}-${msg}-${data}`);
            let result = new Result(code, msg, data);
            resolve(result);
        });
    }
}

module.exports = Result;