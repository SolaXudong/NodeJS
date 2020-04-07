module.exports.test = 'A';
const modB = require('./01_B');
console.log('modA:', modB.test);
module.exports.test = 'AA';
