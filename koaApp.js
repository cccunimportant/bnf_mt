var Koa = require('koa')
var Router = require('koa-router')
// var serve = require('koa-static')
var send = require('koa-send')
var bodyParser = require('koa-bodyparser')
var MT = require('./BnfMt')
var app = new Koa()
var router = new Router()

app.use(bodyParser())

function mt (text) {
  var lex = MT.clex(' ' + text)
  console.log('中文：%j', lex.tokens)
  console.log('詞彙：%j', lex.words)
  var p = MT.parse(lex.words)
  console.log('詞彙：%j', lex.words)
  var eWords = MT.mt(lex.words)
  console.log('英文：%j', eWords)
  console.log('=========================')
  return {cn: lex.tokens, words: lex.words, en: eWords, errors: p.errors}
}

app.use(async function (ctx, next) {
  var method = ctx.request.method
//  console.log('ctx=%s', JSON.stringify(ctx, null, 2))
//  console.log('request=%j', ctx.request)
  if (method === 'GET') {
    await send(ctx, ctx.path, { root: __dirname + '/web' })
  } else if (method === 'POST') {
    var body = ctx.request.body
//    console.log('body=%j', body)
    ctx.body = JSON.stringify(mt(body.source), null, 2)
  }
})

app.use(router.routes()).listen(3000)

// app.use(serve('web'))

/*
router.post('/mt', async function (ctx, next) {
//  await next()
  console.log('ctx=%s', JSON.stringify(ctx, null, 2))
  var body = ctx.request.body
  console.log('body=%j', body)
  ctx.body = body
//  return next()
})
*/
