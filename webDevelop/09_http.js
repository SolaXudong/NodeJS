const http = require('http');
const chalk = require('chalk');
const path = require('path');

const server = http.createServer((req, res) => {
	const filePath = path.join(process.cwd(), req.url);
	console.log('come in: ', filePath);
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/html');
	res.write(
		'<html><body><h1>hello 3</h1></body></html>'
	);
	res.end();
});

server.listen(3000, 'localhost', () => {
	const addr = 'http://localhost:3000';
	console.log('Server stated at ', chalk.green(addr));
});
