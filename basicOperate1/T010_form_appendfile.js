const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/form', (req, res) => {
    console.log(req.method, req.query);
    res.render('form');
});
app.post('/form', (req, res) => {
    console.log(req.method, req.query);
    var postStr = '';
    req.on('data', (chunk) => {
        postStr += chunk + '\n';
    });
    req.on('end', (err, chunk) => {
        console.log(postStr);
        fs.appendFile('./tmp/T010_form.txt', postStr, (err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('写入文件成功');
        });
        res.render('form');
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});