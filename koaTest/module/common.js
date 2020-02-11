exports.getFormData = (ctx) => {
    return new Promise((resolve, reject) => {
        console.log('method: ', ctx.method);
        if (ctx.method == 'GET') {
            console.log('params: ', ctx.query);
            resolve(ctx.query);
        } else if (ctx.method == 'POST') {
            try {
                let str = '';
                ctx.req.on('data', (chunk) => {
                    str += chunk;
                });
                ctx.req.on('end', (chunk) => {
                    console.log('params: ', str);
                    resolve(str);
                });
            } catch (error) {
                reject(error);
            }
        }
    });
};