var rl = require('readline')
var fs = require('fs')
var conv = require('chinese-conv')
// var pinyinJs = require('pinyin.js')
var cn2e = require('./cn2e.json')
var words

var jiebaTagMap = {
  ag: 'n', // adjective morpheme 形容詞語素
  ad: 'v', // adverbial adjective 副詞
  an: 'n', // nominal adjective 名詞形容詞
  dg: 'v', // adverbial morpheme 副詞語素
  ng: 'N', // nominal morpheme 名詞語素
  nr: 'N', // person name 人名
  ns: 'N', // place name 地名
  nt: 'N', // organization name 組織名
  nz: 'N', // other proper name 專有名詞
  tg: 'N', // temporal morpheme 時間語素, ex:晚, 春, 暮, ...
  vg: 'V', // verbal morpheme 語言語素 ex:言, 怒, 觀, 視
  vd: 'V', // adverbial verb 副詞動詞, only:持续, 狡辩, 逆势
  vn: 'V', // nominal verb 名詞動詞, ex: 发展, 工作, 研究, 生產
  m: 'n',  // numeral 數值
  q: 'n',  // quantifier 量詞
  r: 'N',  // pronoun 代名詞
  s: 'N',  // locational noun 位置名詞 ex:家里, 天下, ...
  t: 'N',  // temporal noun 時間名詞  ex:當時, 現在, 目前, ... (註 nt 取 n) 
  v: 'V',  // verb 動詞
  n: 'N',  // jieba POS 裏沒定義，但應該是名詞 ex: 内, 全国, 经济
  a: 'n',  // adjective 形容詞
  d: 'v',  // adverb 副詞
  c: 'c',  // conjunctive 連接詞
  b: 'n',  // discriminative 分辨詞
  e: 'V',  // exclamation 感嘆詞
  f: 'N',  // direction 方向
  g: 'n',  // morpheme 詞素, ex: 很, 比, 較, 每 ....
  i: 'V',  // four-character idiom 四字成語
  j: 'N',  // abbreviation 縮寫
  h: 'n',  // prefix 詞首
  k: 'N',  // suffix 詞尾
  l: 'V',  // idiom 成語
//  c:'',  // common noun
  o: 'V',  // onomatopoeia 擬聲詞
  p: 'n',  // preposition 介詞
  u: 'T',  // auxiliary word 輔助詞 ex:之, 似的, 等等, 的話, ....
  y: 'T',  // model word 模態詞, ex: 呢, 吧, 吗, 么, 啦, ...
//  w:'',  // punctuation 標點, -- 沒有詞
  x: 'N',  // non-morpheme character 非語素特徵, ex: 啷, 椋, 娆, 楂, 椤, 螅, ...
  z: 'n'   // status adjective 狀態形容詞, ex: 沾染习气, 宽宽厚厚, 宽宽大大
}
/*
中央军委|748|nt
阿里|726|nrt
米格|722|nrt
*/

function jieba2tag (jbTag) {
  for (var j in jiebaTagMap) {
    if (jbTag.indexOf(j) >= 0) {
      return jiebaTagMap[j]
    }
  }
  return '#'
}


function jieba2kb (file, posFilter, filterLen) {
  words = []
  var reader = rl.createInterface({
    input: fs.createReadStream(file)
  })
  reader.on('line', function (line) {
    var parts = line.split(/\s+/)
    var word = { cn: conv.sify(parts[0]), tw: conv.tify(parts[0]), count: parseInt(parts[1]), pos: parts[2] }
    if (word.cn === word.tw) word.tw = '_'
    if ((word.cn.length === filterLen || filterLen === 0)) {
      var m = posFilter.exec(word.pos)
      if (m !== null && m.index === 0) {
        word.en = cn2e[word.cn]
        word.tag = jieba2tag(word.pos)
        if (typeof word.en !== 'undefined') {
          if (!word.en[0].match(/[a-zA-Z]/)) {
            word.en = '_'
          }
          words.push(word)
        } else if (word.cn.length === 1) {
          word.en = '?'
          words.push(word)
        }
      }
//      console.log(line)
    }
  })

  reader.on('close', function () {
    words.sort(function (w1, w2) {
      var s1 = w1.tag + w1.pos + ('0000000' + w1.count).slice(-7)
      var s2 = w2.tag + w2.pos + ('0000000' + w2.count).slice(-7)
      return s2.localeCompare(s1)
    })
    for (let word of words) {
      console.log('%s', word.cn)
    }
/*
    console.log('tag|cn|tw|en|pos|count\n---|--|--|---|-----|--')
    for (let word of words) {
      console.log('%s|%s|%s|%s|%s|%d', word.tag, word.cn, word.tw, word.en, word.pos, word.count)
    }
*/    
  })
}

// console.log('jiebaTagMap=%j', jiebaTagMap)

jieba2kb('jieba.dict.utf8', new RegExp(process.argv[2]), parseInt(process.argv[3]))

// node buildKb . 0 > kb.mdo
