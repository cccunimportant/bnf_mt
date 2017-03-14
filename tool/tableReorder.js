var fs = require('fs')
var mdo = require('./mdo')
var editMdo = fs.readFileSync('kb.edit.mdo').toString()
var fields = ['tag', 'cn', 'en', 'pos', 'count']
var rEditMdo = mdo.tableReorder(editMdo, fields)
fs.writeFileSync('kb.edit.mdo.new', rEditMdo)

