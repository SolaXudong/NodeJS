module.exports.test = 'B';
const modA = require('./01_A');
console.log('modB: ', modA.test);
module.exports.test = 'BB';
