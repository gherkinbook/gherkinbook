class FeatureService {
  constructor () {
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

  getFeatures () {
    return this.features
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

var service = new FeatureService()

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.split('-').map(function capitalize (part) {
    return part.charAt(0).toUpperCase() + part.slice(1)
  }).join(' ')
})
Vue.filter('pathify', function (value) {
  return value ? '#' + value : ''
})

Vue.component('multi-select', {
  props: ['list'],
  data () {
    return {
      search: '',
      selectedItems: this.list.selectedItems
    }
  },
  computed: {
    filteredItems () {
      var query = this.search && this.search.toLowerCase()
      return query ? this.list.items.filter(item => item.toLowerCase().indexOf(query) > -1) : this.list.items
    }
  },
  methods: {
    clear () {
      this.search = ''
    },
    select () {
      this.filteredItems.map(tag => {
        if (!this.selectedItems.includes(tag)) {
          this.selectedItems.push(tag)
        }
      })
    },
    unselect () {
      this.selectedItems = this.selectedItems.filter(tag => !this.filteredItems.includes(tag))
    }
  },
  watch: {
    selectedItems: function () {
      this.$emit('change', { items: this.list.items, selectedItems: this.selectedItems })
    }
  }
})

new Vue({// eslint-disable-line
  el: '#app',
  data: {
    title: 'GherkinBook',
    featureList: service.getFeatureList(),
    features: service.getFeatures(),
    tags: {items: service.getTags(), selectedItems: service.getTags()},
    search: '',
    selectedId: '',
    showMenu: true,
    showShowHideSettings: false,
    showFilterSettings: false,
    showPrintSettings: false,
    showScenarioSteps: true,
    showScenarios: true,
    showTags: true,
    showDescriptions: true,
    documentTitle: 'Title',
    documentSubtitle: 'Document Subtitle',
    documentDate: '1 April 2018',
    documentRevision: 'v.1',
    documentOrganisation: 'GherkinBook'
  },
  methods: {
    clear: function (event) {
      this.search = ''
    },
    onFeatureSelect: function (id) {
      this.clear()
      this.selectedId = id
    },
    isActive: function (id) {
      return this.selectedId === id
    },
    toggleMenu: function () {
      this.showMenu = !this.showMenu
    },
    toggleShowHideSettings: function () {
      this.showShowHideSettings = !this.showShowHideSettings
    },
    toggleFilterSettings: function () {
      this.showFilterSettings = !this.showFilterSettings
    },
    togglePrintSettings: function () {
      this.showPrintSettings = !this.showPrintSettings
    },
    onTagsFilterChange: function (tags) {
      this.tags = tags
      this.selectedId = ''
    }
  },
  computed: {
    matchingFeatures () {
      var query = this.search && this.search.toLowerCase()
      var features = this.features
      if (query) {
        features = service.search(query)
      }
      return features
    },
    filteredFeatures () {
      return service.filterFeaturesByTags(this.tags.items.filter(tag => !this.tags.selectedItems.includes(tag)))
    },
    isShowingSearchResults () {
      return this.search && this.search.toLowerCase()
    }
  },
  mounted () {
    var idInUrl = window.location.hash.substr(1)
    if (idInUrl) {
      this.selectedId = service.findFeatureIdByPath(idInUrl)
    }
  },
  updated () {
    if (this.search) {
      document.getElementById('content').scrollTop = 0
    } else {
      if (this.selectedId) {
        var selectedElement = document.getElementById(service.findFeatureById(this.selectedId).path)
        if (selectedElement) {
          selectedElement.scrollIntoView()
        }
      }
    }
  }
})
