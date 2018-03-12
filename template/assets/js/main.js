class FeatureService {
  constructor() {
    this.features = gherkinbook
  }

  getFeatureList() {
    let featureMap = new Map()
    for (let feature of this.features) {
      let tokens = feature.uri.split('/')
      let group = tokens[tokens.length-2]
      if(!featureMap.get(group)) {
        featureMap.set(group, [])
      }
      featureMap.get(group).push({
        id: feature.id,
        name: feature.name,
        path: this.slugify(feature.name)
      })
    }
    var featureList = [];
    for (let [k, v] of featureMap) {
      featureList.push({
        name: k,
        features: v
      })
    }
    return featureList
  }

  getFeatures() {
    return this.features.map(feature => this.parseFeature(feature))
  }

  findFeatureById(id) {
    for (let feature of this.features) {
      if (feature.id === id) {
        return this.parseFeature(feature)
      }
    }
  }

  findFeatureIdByPath(path) {
    for (let feature of this.features) {
      if (this.slugify(feature.name) === path) {
        return feature.id
      }
    }
  }

  parseFeature(feature) {
    return {
      id: feature.id,
      name: feature.name,
      path: this.slugify(feature.name),
      tags: feature.tags ? feature.tags.map(element => element.name) : [],
      description: feature.description,
      scenarios: feature.children ? feature.children.map((scenario) => {
        return {
          keyword: scenario.keyword,
          name: scenario.name,
          description: scenario.description,
          tags: scenario.tags ? scenario.tags.map(tag => tag.name) : [],
          examples: scenario.examples ? scenario.examples.map((example) => {
            return {
              keyword: example.keyword,
              name: example.name,
              tags: example.tags,
              columns: example.tableHeader ? example.tableHeader.cells.map(column => column.value) : [],
              rows: example.tableBody ? example.tableBody.map(row => row.cells.map(cell => cell.value)) : []
            }
          }) : [],
          steps: scenario.steps.map((step) => {
            return {
              keyword: step.keyword,
              text: step.text,
              content: step.argument ? step.argument.content : null,
              dataTable: (step.argument && step.argument.rows) ? step.argument.rows.map(row => row.cells.map(cell => cell.value)) : null
            }
          })
        }
      }) : []
    }
  }

  slugify(text) {
    if (!text || text.length === 0) {
      return ""
    }
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '-and-')         // Replace & with 'and'
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    }
}

function log(stuff) {
  console.log(JSON.parse(JSON.stringify(stuff)))
}

var service = new FeatureService()

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
Vue.filter('pathify', function (value) {
  return value ? '#' + value : ''
})

new Vue({
  el: '#app',
  data: {
    featureList: service.getFeatureList(),
    features: service.getFeatures(),
    search: '',
    selectedId: '',
    featurePositions: []
  },
  methods: {
    clear: function (event){
      event.target.value = ''
    },
    onFeatureSelect : function(id) {
      this.selectedId = id
    },
    isActive: function(id) {
      return this.selectedId === id
    }
  },
  mounted() {
    this.selectedId = service.findFeatureIdByPath(window.location.hash.substr(1))
  }
})
