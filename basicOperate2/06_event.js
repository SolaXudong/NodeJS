const EventEmitter = require('events');

class CustomEvent extends EventEmitter {}
const ce  = new CustomEvent();
ce.on('test', ()=>{
	console.log('this is a test');
});
ce.on('error', err=>{
	console.log(err);
});
ce.on('error', (err, time)=>{
	console.log(err);
	console.log(time);
});
// setInterval(()=>{
// 	ce.emit('test');
// }, 1000);
ce.emit('test');
ce.emit('error', new Error('oops!'));
ce.emit('error', new Error('oops!'), Date.now());
