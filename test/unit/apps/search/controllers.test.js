const nock = require('nock')
const config = require('~/config')

const next = function (error) {
  throw Error(error)
}

describe('Search controller', function () {
  beforeEach(() => {
    this.breadcrumbStub = function () { return this }
  })

  describe('view company result', function () {
    it('should route a uk private ltd company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Private limited company',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        redirect: function (url) {
          expect(url).to.equal('/companies/view/ltd/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk public ltd company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Public limited company',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        redirect: function (url) {
          expect(url).to.equal('/companies/view/ltd/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a uk public other company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: true,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Partnership',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        redirect: function (url) {
          expect(url).to.equal('/companies/view/ukother/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should route a foreign company', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves({
            id: '9999',
            uk_based: false,
            business_type: {
              id: '9bd14e94-5d95-e211-a939-e4115bead28a',
              name: 'Company',
            },
          }),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
        redirect: function (url) {
          expect(url).to.equal('/companies/view/foreign/9999')
          done()
        },
      }
      searchController.viewCompanyResult(req, res, next)
    })
    it('should call next if no company is found', function (done) {
      const searchController = proxyquire('~/src/apps/search/controllers', {
        '../companies/repos': {
          getDitCompany: sinon.stub().resolves(undefined),
        },
      })
      const req = {
        session: {
          token: '1234',
        },
        params: {
          id: '9999',
        },
      }
      const res = {
        locals: {},
        breadcrumb: this.breadcrumbStub,
      }
      const nextStub = (error) => {
        try {
          expect(() => {
            throw error
          }).to.throw()
          done()
        } catch (e) {
          done(e)
        }
      }
      searchController.viewCompanyResult(req, res, nextStub)
    })
  })
})

describe('Search Controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.spy()
    this.controller = require('~/src/apps/search/controllers')
    this.breadcrumbStub = function () { return this }
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('searchAction method', () => {
    const searchTerm = 'mock'
    const expectedSearchEntityResultsData = (companyCount = 3, contactCount = 1, investmentCount = 5) => {
      return [
        {
          count: companyCount,
          entity: 'company',
          path: 'companies',
          text: 'Companies',
        },
        {
          count: contactCount,
          entity: 'contact',
          path: 'contacts',
          text: 'Contacts',
        },
        {
          count: investmentCount,
          entity: 'investment_project',
          path: 'investment-projects',
          text: 'Investment projects',
        },
      ]
    }

    describe('when called with "companies" searchPath', () => {
      const companyResponse = require('~/test/unit/data/search/company')

      it('should render results page for company', (done) => {
        const token = '1234'
        const entityType = 'company'
        const searchPath = 'companies'
        const expectedResults = Object.assign({}, companyResponse, {
          page: 1,
          pagination: null,
        })

        nock(config.apiRoot)
          .get(`/v3/search`)
          .query({
            term: searchTerm,
            entity: entityType,
            limit: 10,
            offset: 0,
          })
          .reply(200, companyResponse)

        this.controller.searchAction(
          {
            session: {
              token,
            },
            query: {
              term: searchTerm,
            },
            params: {
              searchPath,
            },
          },
          {
            breadcrumb: this.breadcrumbStub,
            render: (template, data) => {
              try {
                expect(template).to.equal(`search/views/results-${entityType}`)
                expect(data.searchTerm).to.equal(searchTerm)
                expect(data.searchEntity).to.equal(entityType)
                expect(data.searchEntityResultsData).to.deep.equal(expectedSearchEntityResultsData(0))
                expect(data.results).to.deep.equal(expectedResults)
                done()
              } catch (e) {
                done(e)
              }
            },
          }, this.next
        )
      })
    })

    describe('when called with "contacts" searchPath', () => {
      const contactResponse = require('~/test/unit/data/search/contact')

      it('should render results page for contact', (done) => {
        const entityType = 'contact'
        const searchPath = 'contacts'
        const expectedResults = Object.assign({}, contactResponse, {
          page: 1,
          pagination: null,
        })

        nock(config.apiRoot)
          .get(`/v3/search`)
          .query({
            term: searchTerm,
            entity: entityType,
            limit: 10,
            offset: 0,
          })
          .reply(200, contactResponse)

        this.controller.searchAction(
          {
            session: {
              token: '1234',
            },
            query: {
              term: searchTerm,
            },
            params: {
              searchPath,
            },
          },
          {
            breadcrumb: this.breadcrumbStub,
            render: (template, data) => {
              try {
                expect(template).to.equal(`search/views/results-${entityType}`)
                expect(data.searchTerm).to.equal(searchTerm)
                expect(data.searchEntity).to.equal(entityType)
                expect(data.searchEntityResultsData).to.deep.equal(expectedSearchEntityResultsData())
                expect(data.results).to.deep.equal(expectedResults)
                done()
              } catch (e) {
                done(e)
              }
            },
          }, this.next
        )
      })
    })

    describe('when called with "investment-projects" searchPath', () => {
      const investmentResponse = require('~/test/unit/data/search/investment')

      it('should render results page for contact', (done) => {
        const entityType = 'investment_project'
        const searchPath = 'investment-projects'
        const expectedResults = Object.assign({}, investmentResponse, {
          page: 1,
          pagination: null,
        })

        nock(config.apiRoot)
          .get(`/v3/search`)
          .query({
            term: searchTerm,
            entity: entityType,
            limit: 10,
            offset: 0,
          })
          .reply(200, investmentResponse)

        this.controller.searchAction(
          {
            session: {
              token: '1234',
            },
            query: {
              term: searchTerm,
            },
            params: {
              searchPath,
            },
          },
          {
            breadcrumb: this.breadcrumbStub,
            render: (template, data) => {
              try {
                expect(template).to.equal(`search/views/results-${entityType}`)
                expect(data.searchTerm).to.equal(searchTerm)
                expect(data.searchEntity).to.equal(entityType)
                expect(data.searchEntityResultsData).to.deep.equal(expectedSearchEntityResultsData())
                expect(data.results).to.deep.equal(expectedResults)
                done()
              } catch (e) {
                done(e)
              }
            },
          }, this.next
        )
      })
    })

    describe('when called with an incorrect searchPath', () => {
      it('should render the search index route', (done) => {
        this.controller.searchAction(
          {
            session: {
              token: '1234',
            },
            query: {
              term: searchTerm,
            },
            params: {
              searchPath: 'dummy-path',
            },
          },
          {
            breadcrumb: this.breadcrumbStub,
            render: (template, data) => {
              try {
                expect(template).to.equal('search/views/index')
                done()
              } catch (e) {
                done(e)
              }
            },
          }, this.next
        )
      })
    })

    describe('#renderInvestmentProjects', () => {
      const investmentResponse = require('~/test/unit/data/search/investment')
      const searchTerm = 'london'

      beforeEach(async () => {
        nock(config.apiRoot).get(`/v3/search`)
          .query({
            term: searchTerm,
            entity: 'investment_project',
            limit: 10,
            offset: 0,
          })
          .reply(200, investmentResponse)

        this.next = this.sandbox.spy()
        this.renderFunction = this.sandbox.spy()
        this.req = {
          session: { token: 'abcd' },
          query: {
            term: searchTerm,
          },
          params: {
            searchPath: 'dummy-path',
          },
        }
        this.res = {
          breadcrumb: this.breadcrumbStub,
          render: this.renderFunction,
        }

        await this.controller.renderInvestmentProjects(this.req, this.res, this.next)
      })

      it('should render investment search results view', () => {
        expect(this.renderFunction)
          .to.be.calledWith(
            sinon.match.any, sinon.match({
              searchEntity: 'investment_project',
              searchPath: 'investment-projects',
              searchTerm: 'london',
              results: sinon.match.object,
              searchEntityResultsData: sinon.match.array,
            })
          )
      })
    })
  })
})
