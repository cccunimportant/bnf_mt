var fs = require('fs')
var cn1 = fs.readFileSync('cn2e_cn.mdo', 'utf8')
var cn1e = fs.readFileSync('cn2e_e.mdo', 'utf8')
var cnLines = cn1.split('\n')
var eLines = cn1e.split('\n')
for (var i = 0; i < cnLines.length; i++) {
  var e = (eLines[i] == null || eLines[i].trim() === cnLines[i].trim()) ? '_' : eLines[i]
  console.log(cnLines[i] + '|' + e.toLowerCase())
}
