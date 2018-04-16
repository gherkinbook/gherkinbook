var service = 'undefined' !== typeof gherkinbook ? new FeatureService(gherkinbook) : service = new FeatureService([])

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
    showSettings: false,
    activeSettingsTab: 1,
    showHideOptions: {
      showScenarioSteps: true,
      showScenarios: true,
      showTags: true,
      showDescriptions: true
    },
    printOptions: {
      documentTitle: 'Title',
      documentSubtitle: 'Document Subtitle',
      documentDate: '1 April 2018',
      documentRevision: 'v.1',
      documentOrganisation: 'GherkinBook'
    }
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
    toggleSettings: function (){
      this.showSettings = !this.showSettings
    },
    isActiveSettingsTab (tab) {
      return this.activeSettingsTab === tab
    },
    setActiveSettingsTab (tab) {
      return this.activeSettingsTab = tab
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
