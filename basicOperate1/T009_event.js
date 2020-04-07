var events = require('events');
var eventEmitter = new events.EventEmitter();

// 广播和接收广播
// 监听my_event的广播
eventEmitter.on('my_event', (data) => {
    console.log('data received succesfully. msg: ', data);
});
setTimeout((data) => {
    console.log('开始广播...')
    eventEmitter.emit('my_event', '{"msg":"你好","age":22}');
}, 2000);