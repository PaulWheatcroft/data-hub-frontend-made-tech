const investmentProjectData = require('~/test/unit/data/investment/project-summary.json')
const interactionsListData = require('~/test/unit/data/investment/interaction/interactions.json')
const interactionCompanyDisplayFormated = require('~/test/unit/data/investment/interaction/interaction-formatted.json')

describe('Investment Interactions Index controller', () => {
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create()
    this.next = this.sandbox.stub()
    this.getInteractionsForInvestmentStub = this.sandbox.stub().resolves(interactionsListData)
    this.controller = proxyquire('~/src/apps/investment-projects/controllers/interactions/list', {
      '../../../interactions/repos': {
        getInteractionsForInvestment: this.getInteractionsForInvestmentStub,
      },
    })
  })

  afterEach(() => {
    this.sandbox.restore()
  })

  describe('#indexGetHandler', () => {
    it('should return interactions with currentNavItem set to interactions', (done) => {
      this.controller.indexGetHandler({
        session: {
          token: 'abcd',
        },
        params: {
          id: 'example-id-1234',
        },
      }, {
        locals: {
          title: [],
          projectData: investmentProjectData,
        },
        render: (template, data) => {
          try {
            expect(template).to.equal('investment/interaction/index')
            expect(data.currentNavItem).to.equal('interactions')
            expect(data.interactions).to.deep.equal(interactionCompanyDisplayFormated)
            done()
          } catch (error) {
            done(error)
          }
        },
      }, this.next)
    })
  })
})
