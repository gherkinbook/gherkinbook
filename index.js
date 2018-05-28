const fs = require('fs')
const path = require('path')
const glob = require('glob')
const crypto = require('crypto')
const Gherkin = require('gherkin')
const configFileName = '.gherkinbook'
const outputFileName = 'gherkinbook.min.js'
const cucumberOutputFileName = 'gherkinbook-cucumber.min.js'

if (!fs.existsSync(configFileName)) {
  console.error('GherkinBook Generator config file ' + configFileName + ' is missing.')
}

const config = JSON.parse(fs.readFileSync(configFileName, 'utf8'))

function readTestResults () {
  return new Promise(function (resolve, reject) {
    glob(config.cucumberJson, function (err, files) {
      console.log('Reading Test Results....')
      if (err) {
        console.error('Reading Test Results....Failed')
        reject(err)
      }
      var testResults = []
      files.forEach(function (file) {
        var content = fs.readFileSync(file, 'utf-8')
        var results = JSON.parse(content) || []
        testResults = testResults.concat(results)
      })
      console.log('Reading Test Results....Done')
      resolve(testResults)
    })
  })
}

function readFeatures () {
  return new Promise(function (resolve, reject) {
    glob(config.source, function (err, files) {
      console.log('Reading Feature Files...')
      if (err) {
        console.error('Reading Feature Files...Failed')
        reject(err)
      }
      var parser = new Gherkin.Parser(new Gherkin.AstBuilder())
      var features = []
      files.forEach(function (fileName) {
        var fileContent = fs.readFileSync(fileName, 'utf-8')
        var feature = parser.parse(fileContent).feature || {}
        feature.id = crypto.createHash('md5').update(fileName).digest('hex')
        feature.uri = fileName
        features.push(feature)
      })
      console.log('Reading Feature Files...Done')
      resolve(features)
    })
  })
}

function findTestResult(tests, featureName, scenarioName, stepName) {
  var result = {}
  tests.forEach(feature => {
    if (feature.name !== featureName) return
    feature.elements.forEach(scenario => {
      if (scenario.name !== scenarioName) return
       scenario.steps.forEach(step => {
         if (step.name !== stepName) return
         result = step.result || {}
       })
    })
  })
  return result
}

function publish (varibleName, data, filename) {
  if (data) {
    var gherkinbookData = 'var ' + varibleName + ' = ' + JSON.stringify(data)
    var gherkinbookFile = path.join(config.output, filename)
    fs.writeFileSync(gherkinbookFile, gherkinbookData, 'utf-8')
    console.log('GherkinBook data ('+ filename +') has been successfully generated')
  }
}

function bundle () {
  return new Promise(function (resolve, reject) {
    Promise.all([readFeatures(), readTestResults()]).then(results => {
      publish('gherkinbook', results[0], outputFileName)
      publish('gherkinbooktests', results[1], cucumberOutputFileName)
    }).catch((err) => reject(err))
  })
}

function main () {
  bundle().catch(err => console.error(err))
}

main()
