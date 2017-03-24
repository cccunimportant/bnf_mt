// S = Q? NP? VP* T* .+
// VP = (v* V+ v*)+ NP*
// NP = (n* N+) (c NP)*

/* 無法正確解析的語句

好n 喝V 的n 蘋果N 牛奶N
*/

// 小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？
// NP   V  n    NP      V  v  NP   n    NP      Q    NP v  V  n     NP
//      VP              VP                              VP
var pinyinJs = require('pinyin.js')
var cc = require('chinese_convert')
var kb = require('./kb')

// KoaApp 的錯誤和下列中文全域變數有關。
var wi, words, errors

function isTag (tag) {
  var word = words[wi]
  if (typeof word === 'undefined') return false
  return (tag === word.tag)
}

// var print = function (s) { process.stderr.write(s) }
// var print = function (s) { process.stdout.write(s) }
var print = function (s) { console.log(s) }

function next (tag) {
  var w = words[wi]
  if (isTag(tag)) {
    print(w.cn + ':' + tag + ' ')
    errors[wi] = ''
    wi++
    return w
  } else {
    print(w.cn + ':' + tag + '≠' + w.tag + ' ')
    errors[wi] = w.tag + '≠' + tag
    throw Error(errors[wi])
  }
}

// S = Q? NP? VP* T* .+
function S () {
  try {
    if (isTag('Q')) {
      next('Q')
    }
    if (isTag('n') || isTag('N')) {
      NP()
    }
    while (isTag('V') || isTag('v')) {
      VP()
    }
    while (isTag('T')) next('T')
    do { next('.') } while (isTag('.'))
  } catch (err) {
    for (; wi < words.length && words[wi].tag !== '.'; wi++) {
    }
    for (; wi < words.length && words[wi].tag === '.'; wi++) {
    }
  }
//  console.error('')
}

// VP = (v* V+ v*)+ NP*
function VP () {
  do {
    while (isTag('v')) next('v')
    do { next('V') } while (isTag('V'))
    while (isTag('v')) next('v')
  } while (isTag('v') || isTag('V'))

  while (isTag('n') || isTag('N')) {
    NP()
  }

//  if (isTag('v') || isTag('V')) VP()
}

// NP = (n* N+) (c NP)*
function NP () {
  while (isTag('n')) next('n')

  do {
    next('N')
  } while (isTag('N'))

  while (isTag('c')) {
    next('c')
    NP()
  }
}

var exps = [
  /^\s*([\u4E00-\u9FFF]{1,8}):([a-z])\s+/i,
  /^\s*(\w{1,20}):([a-z])\s+/i,
  /^[\u4E00-\u9FFF]{4}/,
  /^[\u4E00-\u9FFF]{3}/,
  /^[\u4E00-\u9FFF]{2}/,
  /^./]

function clex (text) {
  text = text.replace(/\n/g, '↓')
  var m
  var lwords = []
  var tokens = []
  for (var i = 0; i < text.length;) {
    for (var ri = 0; ri < exps.length; ri++) {
      var word = null
      m = exps[ri].exec(text.substr(i, 12))
      if (m) {
        if (ri === 0) { // ex: 瑪莉:N
          word = {cn: cc.tw2cn(m[1]), en: '_', tag: m[2]}
        } else if (ri === 1) { // ex: John:N
          word = {cn: m[1], en: m[1], tag: m[2]}
        } else { // 1-4 字的中文詞
          word = kb.get(m[0])
        }
        if (word == null && ri === exps.length - 1) { // 單一字元 .
          word = {cn: m[0], tag: '?'}
        }
        if (word != null) {
          if (word.cn !== ' ' && word.cn !== '\n') {
            lwords.push(word)
            tokens.push(m[0].trim())
          }
          break
        }
      }
    }
    i = i + m[0].length
  }
  return {tokens: tokens, words: lwords}
}

function parse (pWords) {
  words = pWords
  errors = []
  for (wi = 0; wi < words.length;) {
    S()
  }
  return {errors: errors}
}

function english (word) {
  if (word.en === '_') {
    return '_' + pinyinJs(word.cn).toString().replace(',', '_')
  } else {
    return word.en
  }
}

function mt (words) {
  var eWords = []
  for (var i in words) {
    eWords.push(english(words[i]))
  }
  return eWords
}

function analysis (text) {
  var lex = clex(' ' + text)
  console.log('中文：%j', lex.tokens)
  console.log('詞彙：%j', lex.words)
  var p = parse(lex.words)
  console.log('錯誤：%j', p.errors)
  var eWords = mt(lex.words)
  console.log('英文：%j', eWords)
  console.log('=========================')
  return {cn: words, en: eWords}
}

module.exports = { kb: kb, parse: parse, clex: clex, mt: mt, analysis: analysis }
