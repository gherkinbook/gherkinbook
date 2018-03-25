class FeatureService {// eslint-disable-line
  constructor (gherkinbook = []) {
    this.features = gherkinbook.map(feature =>
      this.parseFeature(feature)
    ).filter(feature => feature.name)

    this.fuse = new Fuse(this.features, {
      threshold: 0.3,
      keys: [
        'name', 'description', 'tags', 'scenarios.name',
        'scenarios.description', 'scenarios.tags',
        'scenarios.steps.text'
      ]
    })
  }

  getFeatures () {
    return this.features
  }

  setFeatures (features) {
    this.features = features
  }

  getFeatureList () {
    let featureMap = new Map()
    for (let feature of this.features) {
      if (!feature.name) {
        continue
      }
      let tokens = feature.uri.includes('/') ? feature.uri.split('/') : feature.uri.split('\\')
      let group = tokens[tokens.length - 2]
      if (!featureMap.get(group)) {
        featureMap.set(group, [])
      }
      featureMap.get(group).push({
        id: feature.id,
        name: feature.name,
        path: this.slugify(feature.name)
      })
    }
    var featureList = []
    for (let [k, v] of featureMap) {
      featureList.push({
        name: k,
        features: v
      })
    }
    return featureList
  }

  getTags () {
    let tags = new Set()
    this.features.map(feature => {
      feature.tags.map(tag => tags.add(tag))
      feature.scenarios.map(scenario => scenario.tags.map(tag => tags.add(tag)))
    })
    return Array.from(tags)
  }

  findFeatureById (id) {
    for (let feature of this.features) {
      if (feature.id === id) {
        return this.parseFeature(feature)
      }
    }
  }

  findFeatureIdByPath (path) {
    for (let feature of this.features) {
      if (this.slugify(feature.name) === path) {
        return feature.id
      }
    }
  }

  search (keyword) {
    return this.fuse.search(keyword)
  }

  /**
  * Removes Features and Scenarios specified by the tag list
  * and returns filtered list
  **/
  filterFeaturesByTags (tagsExcluded) {
    var filtered = []
    for (let feature of this.features) {
      if (!feature.tags.some(tag => tagsExcluded.includes(tag))) {
        feature.scenarios = feature.scenarios.filter(scenario => !scenario.tags.some(tag => tagsExcluded.includes(tag)))
        if (feature.scenarios.length) {
          filtered.push(feature)
        }
      }
    }
    return filtered
  }

  parseFeature (feature) {
    return {
      id: feature.id,
      name: feature.name,
      path: this.slugify(feature.name),
      uri: feature.uri,
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

  slugify (text = '') {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')// Replace spaces with -
      .replace(/&/g, '-and-')// Replace & with 'and'
      .replace(/[^\w-]+/g, '')// Remove all non-word chars
      .replace(/--+/g, '-')// Replace multiple - with single -
      .replace(/^-+/, '')// Trim - from start of text
      .replace(/-+$/, '')// Trim - from end of text
  }
}
