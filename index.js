// S = Q? NP* (VP)* T* .
// VP = (v* V+ v*)+ NP* | VP+
// NP = (n* N+) | NP (c NP)*

// 小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？
// NP   V  n    NP      V  v  NP   n    NP      Q    NP v  V  n     NP
//      VP              VP                              VP
var pinyinJs = require('pinyin.js')
var cc = require('chinese_convert')
var kb = require('./kb')

var wi = 0
var words = []

function isTag (tag) {
  var word = kb.get(words[wi])
  if (typeof word === 'undefined') return false
  return (tag === word.tag)
}

function c2e (w) {
  var word = kb.get(w)
  if (typeof word === 'undefined' || word.en === '_') {
    var cn = cc.tw2cn(w)
    return '_' + pinyinJs(cn).toString().replace(',', '_')
  } else {
    return word.en
  }
}

var print = function (s) { process.stderr.write(s) }

function next (tag) {
  var w = words[wi]
  if (isTag(tag)) {
    print(w + ':' + tag + ' ')
    wi++
    return w
  } else {
    print(w + ':' + tag + '≠' + kb.get(w) + ' ')
    throw Error('Error !')
  }
}

// S = Q? NP* (VP)* T* .
function S () {
  if (isTag('Q')) {
    next('Q')
  }
  while (isTag('n') || isTag('N')) {
    NP()
  }
  while (isTag('V') || isTag('v')) {
    VP()
  }
  while (isTag('T')) next('T')
  next('.')
  console.error('')
}

// VP = (v* V+ v*)+ NP* | VP+
function VP () {
  do {
    while (isTag('v')) next('v')
    do { next('V') } while (isTag('V'))
    while (isTag('v')) next('v')
  } while (isTag('v') || isTag('V'))

  while (isTag('n') || isTag('N')) {
    NP()
  }

  if (isTag('v') || isTag('V')) VP()
}

// NP = (n* N+) | NP (c NP)*
function NP () {
  while (isTag('n')) next('n')

  do {
    next('N')
  } while (isTag('N'))

  if (isTag('c')) {
    next('c')
    NP()
  }
}

function clex (text) {
  var words = []
  for (var i = 0; i < text.length;) {
    for (var len = 4; len >= 1; len--) {
      var c = text.substr(i, len)
      var word = kb.get(c)
      if ((len === 1 && c !== ' ') || typeof word !== 'undefined') {
        words.push(word.cn)
        break
      }
    }
    i = i + Math.max(1, len)
  }
  return words
}

function parse (pWords) {
  words = pWords
  for (wi = 0; wi < words.length;) {
    S()
  }
}

function mt (words) {
  var eWords = []
  for (var i in words) {
    eWords.push(c2e(words[i]))
  }
  return eWords
}

function analysis (text) {
  var words = clex(text)
  console.log('中文：%j', words)
  parse(words)
  var eWords = mt(words)
  console.log('英文：%j', eWords)
  console.log('=========================')
  return {cn: words, en: eWords}
}

module.exports = { kb: kb, parse: parse, clex: clex, mt: mt, analysis: analysis }
