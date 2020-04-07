const fs = require('fs');
const chalk = require('chalk');

const result = fs.readFile('./02_require_引用内置模块.js2', (err, data) => {
	if (err) {
		console.log('【err】', err);
	} else {
		console.log('【data】', data);
		console.log('【data.toString()】', data.toString());
	}
});

console.log(chalk.red('【result】', result));
