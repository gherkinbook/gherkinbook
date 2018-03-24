describe('Filter Features By Tags', function () {
  var service = new FeatureService()

  beforeEach(function () {
    service.setFeatures([{
      name: 'f1',
      tags: ['t1', 't2'],
      scenarios: [
        { name: 'f1-s1', tags: ['t3'] },
        { name: 'f1-s2', tags: ['t3', 't4'] },
        { name: 'f1-s3', tags: [] }
      ]
    }, {
      name: 'f2',
      tags: [],
      scenarios: [
        { name: 'f2-s1', tags: [] },
        { name: 'f2-s2', tags: [] }
      ]
    }, {
      name: 'f3',
      tags: ['t5'],
      scenarios: [
        { name: 'f3-s1', tags: ['t3'] },
        { name: 'f3-s2', tags: ['t3'] }
      ]
    }])
  })

  it('should filter out features by the tags specified', function () {
    let filteredFeatures = service.filterFeaturesByTags(['t1'])
    chai.expect(filteredFeatures).to.have.lengthOf(2)
    chai.expect(filteredFeatures[0]).to.not.have.property('name', 'f1')
  })

  it('should NOT filter out features or scenarios if they dont have any tags', function () {
    let filteredFeatures = service.filterFeaturesByTags(['t1', 't2', 't3'])
    chai.expect(filteredFeatures).to.have.lengthOf(1)
    chai.expect(filteredFeatures[0]).to.have.property('name', 'f2')
  })

  it('should filter out scenarios by the tags specified', function () {
    let filteredFeatures = service.filterFeaturesByTags(['t4'])
    console.log(filteredFeatures)
    chai.expect(filteredFeatures).to.have.lengthOf(3)
    chai.expect(filteredFeatures[0].scenarios).to.have.lengthOf(2)
    chai.expect(filteredFeatures[0].scenarios[1]).to.not.have.property('name', 'f1-s2')
  })

  it('should filter out feature if all scenarios have the tag specified', function () {
    let filteredFeatures = service.filterFeaturesByTags(['t3'])
    chai.expect(filteredFeatures).to.have.lengthOf(2)
    chai.expect(filteredFeatures[0]).to.have.property('name', 'f1')
    chai.expect(filteredFeatures[1]).to.have.property('name', 'f2')
    chai.expect(filteredFeatures[0].scenarios).to.have.lengthOf(1)
  })
})
