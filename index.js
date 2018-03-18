const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const Gherkin = require('gherkin')
const configFileName = '.gherkinbook'
const outputFileName = 'gherkinbook.min.js'

if (!fs.existsSync(configFileName)) {
  console.error('GherkinBook Generator config file ' + configfile +' is missing.')
}

const config = JSON.parse(fs.readFileSync(configFileName, 'utf8'))

function findFeatureFiles(base, files, result) {
  files = files || fs.readdirSync(base)
  result = result || []
  files.forEach(function (file) {
    var newbase = path.join(base, file)
    if (fs.statSync(newbase).isDirectory()) {
      result = findFeatureFiles(newbase, fs.readdirSync(newbase), result)
    } else {
      if (file.endsWith('.feature')) {
        result.push(newbase)
      }
    }
  })
  return result
}

var files = findFeatureFiles(config.source)
var parser = new Gherkin.Parser(new Gherkin.AstBuilder())
var bundle = []
files.forEach(function (fileName) {
  var fileContent = fs.readFileSync(fileName, 'utf-8')
  var feature = parser.parse(fileContent).feature || {}
  feature.id = crypto.createHash('md5').update(fileName).digest('hex')
  feature.uri = fileName

  bundle.push(feature)
})
var gherkinbook = 'var gherkinbook =' + JSON.stringify(bundle)
fs.writeFileSync(path.join(config.output, outputFileName), gherkinbook, 'utf-8')
