/*
let pinyin = require('js-pinyin'); 
console.log(pinyin.getFullChars('管理员')); 
console.log(pinyin.getCamelChars('管理员')); 
console.log(pinyin.getCamelChars('1234')); 
console.log(pinyin.getCamelChars('english'));
*/

var pinyinJs = require('pinyin.js')
console.log(pinyinJs('管理员').join(' '))
