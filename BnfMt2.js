// S = Q? NP* (VP)* T* .
// VP = VP (c VP)* | (v* V+ v*)+ NP*
// NP = NP (c NP)* | (n* N+)

// 小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？
// NP   V  n    NP      V  v  NP   n    NP      Q    NP v  V  n     NP
//      VP              VP                              VP
var pinyinJs = require('pinyin.js')
var cc = require('chinese_convert')
var kb = require('./kb')

var wi = 0
var words = []
var mtWords = []

function isTag (tag) {
  var word = kb.get(words[wi])
  if (typeof word === 'undefined') return false
  return (tag === word.tag)
}

function mt (w) {
  var word = kb.get(w)
  if (typeof word === 'undefined' || word.en === '_') {
    var cn = cc.tw2cn(w)
    return '_' + pinyinJs(cn).toString().replace(',', '_')
  } else {
    return word.en
  }
}

var print = function (s) { process.stdout.write(s) }

function next (tag) {
  var w = words[wi]
  if (isTag(tag)) {
    print(w + ':' + tag + ' ')
    mtWords.push(mt(w))
    wi++
    return w
  } else {
    print(w + ':' + tag + ':X ')
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
  console.log('')
}

// VP = VP (c VP)* | (v* V+ v*)+ NP*
function VP () {
  while (isTag('v') || isTag('V')) {
    while (isTag('v')) next('v')
    do { next('V') } while (isTag('V'))
    while (isTag('v')) next('v')
  }
  while (isTag('n') || isTag('N')) {
    NP()
  }
}

// NP = NP (c NP)* | (n* N+)
function NP () {
  while (isTag('n')) next('n')
  do { next('N') } while (isTag('N'))
  if (isTag('c')) {
    next('c')
    NP()
  }
}

function parse (sentence) {
  wi = 0
  words = sentence.split(' ')
  mtWords = []
  console.log('======= 中文 =============')
  console.log(words.join(' '))
  console.log('======= 剖析 =============')
  while (wi < words.length) {
    S()
  }
  console.log('======= 英文 =============')
  console.log(mtWords.join(' '))
}

parse('小明 有 5 個 蘋果 ， 給 了 小華 3 個 蘋果 ， 請問 他 還 剩 幾 個 蘋果 ？')
parse('小明 和 小華 一起 吃 蘋果 。')
parse('黑 黑 的 天 ， 大 大 的 風 ， 爸爸 去 捕 魚 ， 為甚麼 還 不 回 家 ？')
// 全文： https://www.facebook.com/photo.php?fbid=1464494203561879&set=p.1464494203561879&type=3&theater
// parse('聽 狂 風 怒 吼 ，  真 叫 我們 害怕 。 爸爸！爸爸！ 我們 心理 多麼 牽掛 ， 只要 您 早點兒 回家，就是 空 船 也罷 ！')
// parse('我 的 好 孩子 ，  爸爸 回來 啦 ！ 你 看 船艙 裡 ， 裝 滿 魚 和 蝦 ， 努力 就 有 好 收穫 ， 大 風 大 浪 不用 怕 ， 快 去 告訴 媽媽 ， 爸爸 已經 回 家 ！')
parse('風 與 日 。 風 日 爭 ， 旅人 至 ， 脫 者 勝 ， 風 狂 吹 ， 人 緊 衣 ， 風 敗 ， 日 暖 照 ， 人 脫 衣 ， 日 勝 。')
