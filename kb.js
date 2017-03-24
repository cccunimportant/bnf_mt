// 標記用法 ==> N:名詞 V:動詞 n:名詞修飾 v:動詞修飾 Q:疑問詞 T:句尾詞 -:刪除該詞
// 您可以在 kb.edit.mdo 中運用這些標記對 kb.mdo 修正，但請不要直接修改 kb.mdo
var path = require('path')
var fs = require('fs')
var cc = require('chinese_convert')
var mdo = require('mdo')
var kb = {}

kb.toCn = function (dict) {
  for (var i in dict) {
    var word = dict[i]
    if (typeof word.cn !== 'undefined') {
      word.cn = cc.tw2cn(word.cn)
    }
  }
}

kb.getByCn = function (cn) {
  var word = kb.cnMap[cn]
  if (typeof word !== 'undefined' && word.tag !== '-') {
    return word
  } else {
    return undefined
  }
}

kb.get = function (w) {
  var cn = cc.tw2cn(w)
  var word = kb.getByCn(cn)
  return word
}

kb.load = function () {
  var kbMdo = fs.readFileSync(path.join(__dirname,  'kb.mdo')).toString()
  var kbArray = mdo.parseTable(kbMdo, ['count', 'pos', 'tw'])
  var editMdo = fs.readFileSync(path.join(__dirname , 'kb.edit.mdo')).toString()
  var editArray = mdo.parseTable(editMdo)
  kb.toCn(editArray)
  var dict = editArray.concat(kbArray)
  kb.cnMap = mdo.index(dict, 'cn')
}

kb.load()

module.exports = kb
