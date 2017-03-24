<p align="center">
  <a href="https://travis-ci.org/ccckmit/chinese_convert"><img src="https://img.shields.io/travis/ccckmit/chinese_convert.svg" alt="Travis"></a>
  <a href="http://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="Standard - JavaScript Style Guide"></a>
  <a href="https://www.npmjs.com/package/chinese_convert"><img src="https://img.shields.io/npm/dm/chinese_convert.svg" alt="npm downloads"></a>
  <a href="https://www.npmjs.com/package/chinese_convert"><img src="https://img.shields.io/npm/v/chinese_convert.svg" alt="npm version"></a>
</p>

# Bnf_mt : Human Made Spoken Language with BNF

中文： 人造交談語言的 parse 翻譯系統

## Install

```
$ npm install bnf_mt
```

## BNF

We design 3 rules for any language. It's seems easy & nice.

```
S = Q? NP* (VP)* T* .
VP = (v* V+ v*)+ NP* | VP+
NP = (n* N+) | NP (c NP)*
```

## Example

File: mtTest.js

```
var MT = require('bnf_mt')

MT.analysis('小明有5個蘋果，給了小華3個蘋果，請問他還剩幾個蘋果？')
MT.analysis('小明和小華一起吃蘋果。')
MT.analysis('黑黑的天，大大的風，爸爸去捕魚，為甚麼 還 不 回 家？')
MT.analysis('約翰與安妮是 一 對 戀人。')
MT.analysis('風與日。風日爭，旅人至，脫者勝，風狂吹，人緊衣，風敗，日暖照，人脫衣，日勝。')
```

## Run 

```
$ node mtTest.js
中文：["小明","有","5","个","苹果","，","给","了","小华","3","个","苹果","，","
请问","他","还","剩","几个","苹果","？"]
小明:N 有:V 5:n 个:n 苹果:N ，:.
给:V 了:v 小华:N 3:n 个:n 苹果:N ，:.
请问:Q 他:N 还:v 剩:V 几个:n 苹果:N ？:.
英文：["_xiǎo_míng","have","5","_gè","apple","，","give","_le","_xiǎo_huá","3"
,"_gè","apple","，","Q","he","still","remain","several","apple","？"]
=========================
中文：["小明","和","小华","一起","吃","苹果","。"]
小明:N 和:c 小华:N 一起:v 吃:V 苹果:N 。:.
英文：["_xiǎo_míng","and","_xiǎo_huá","together","eat","apple","。"]
=========================
中文：["黑","黑","的","天","，","大大","的","风","，","爸爸","去","捕","鱼","，"
,"为甚么","还","不","回","家","？"]
黑:n 黑:n 的:n 天:N ，:.
大大:n 的:n 风:N ，:.
爸爸:N 去:V 捕:V 鱼:N ，:.
为甚么:Q 还:v 不:v 回:V 家:N ？:.
英文：["black","black","_de","sky","，","greatly","_de","wind","，","papa","go",
"hunt","fish","，","why","still","no","back","home","？"]
=========================
中文：["约翰","与","安妮","是","一","对","恋人","。"]
约翰:N 与:c 安妮:N 是:V 一:n 对:n 恋人:N 。:.
英文：["john","and3","annie","is","one","_duì","lassie","。"]
=========================
中文：["风","与","日","。","风","日","争","，","旅人","至","，","脱","者","胜","
，","风","狂","吹","，","人","紧","衣","，","风","败","，","日","暖","照","，","
人","脱","衣","，","日","胜","。"]
风:N 与:c 日:N 。:.
风:N 日:N 争:V ，:.
旅人:N 至:V ，:.
脱:V 者:N 胜:V ，:.
风:N 狂:V 吹:V ，:.
人:N 紧:V 衣:N ，:.
风:N 败:V ，:.
日:N 暖:V 照:V ，:.
人:N 脱:V 衣:N ，:.
日:N 胜:V 。:.
英文：["wind","and3","sun","。","wind","sun","compete","，","traveler","come","
，","takeOff","guy","win","，","wind","wild","blow","，","people","tight","cloth
","，","wind","lose","，","sun","warm","shine","，","people","takeOff","cloth","
，","sun","win","。"]
=========================
```

## comment

我們用《結巴》字典做基礎，但詞性標註還沒辦法完全正確，字典還有很多地方需要改進。




