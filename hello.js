var addon = require('bindings')('hello');
var vv = require('./server');
console.log(addon.hello()); // 'world'