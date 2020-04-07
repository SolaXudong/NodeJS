const {
	argv,
	argv0,
	execArgv,
	execPath
} = process;
argv.forEach(item => {
	console.log('【item】', item);
});
console.log('【argv0】', argv0);
console.log('【execArgv】', execArgv);
console.log('【execPath】', execPath);
// >node --inspect xx.js --test a=1 b=2
const {
	env
} = process;
console.log('【env】', env);
