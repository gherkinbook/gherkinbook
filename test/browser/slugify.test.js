var service = new FeatureService()

describe('slugify', function () {
  it('should replace spaces with -', function () {
    chai.expect(service.slugify('Hello World')).to.equal('hello-world')
  })

  it('should replace double spaces with -', function () {
    chai.expect(service.slugify('Hello  World')).to.equal('hello-world')
  })

  it('should replace & with and', function () {
    chai.expect(service.slugify('Hello&World')).to.equal('hello-and-world')
  })

  it('should trim spaces from start end end', function () {
    chai.expect(service.slugify(' Hello World  ')).to.equal('hello-world')
  })

  it('should remove all non-word chars', function () {
    chai.expect(service.slugify('Hello; World!')).to.equal('hello-world')
  })
})
