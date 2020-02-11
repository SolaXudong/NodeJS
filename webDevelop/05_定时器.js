// 添加到下一个任务队列的队首（异步，常用）
setImmediate(() => {
	console.log('setImmediate');
});
// 添加到下一个任务队列的队首（异步，常用，先于immediate）
let ss = setInterval(() => {
	console.log('setInterval');
	clearInterval(ss);
}, 0);
// 添加到下一个任务队列的队首（异步，常用，先于immediate）
setTimeout(() => {
	console.log('setTimeout');
}, 0);
// 添加到本次任务队列的队尾（同步，用时慎重）
process.nextTick(() => {
	console.log('nextTick');
	process.nextTick(() => {
		console.log('nextTick2');
	});
});
