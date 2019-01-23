const buildMiddlewareParameters = require('~/test/unit/helpers/middleware-parameters-builder.js')

const config = require('~/config')
const companyMock = require('~/test/unit/data/companies/companies-house.json')
const dnbCompanyMock = require('~/test/unit/data/companies/dnb-company.json')
const coreTeamMock = require('~/test/unit/data/companies/one-list-group-core-team.json')

const { renderAdvisers } = require('~/src/apps/companies/controllers/advisers')

describe('Company contact list controller', () => {
  describe('#renderAdvisers', () => {
    context('when the feature flag is enabled', () => {
      const commonTests = (expectedBreadcrumbs, expectedTemplate, expectedCompanyName) => {
        it('should add two breadcrumbs', () => {
          expect(this.middlewareParameters.resMock.breadcrumb).to.have.been.calledTwice
        })

        it('should add the company breadcrumb', () => {
          expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(expectedBreadcrumbs[0].text, expectedBreadcrumbs[0].href)
        })

        it('should add the Advisers breadcrumb', () => {
          expect(this.middlewareParameters.resMock.breadcrumb).to.be.calledWith(expectedBreadcrumbs[1].text)
        })

        it('should render the correct template', () => {
          expect(this.middlewareParameters.resMock.render).to.be.calledWith(expectedTemplate)
        })

        it('should set the company name', () => {
          expect(this.middlewareParameters.resMock.render.args[0][1].companyName).to.equal(expectedCompanyName)
        })

        it('should set the core team', () => {
          expect(this.middlewareParameters.resMock.render.args[0][1].coreTeam).to.not.be.null
        })

        it('should not call next', () => {
          expect(this.middlewareParameters.nextSpy).to.not.be.called
        })
      }

      context('when the company does not have a DUNS number', () => {
        beforeEach(async () => {
          this.middlewareParameters = buildMiddlewareParameters({
            company: companyMock,
            features: {
              'companies-advisers': true,
            },
          })

          nock(config.apiRoot)
            .get(`/v3/company/${companyMock.id}/one-list-group-core-team`)
            .reply(200, coreTeamMock)

          await renderAdvisers(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests([
          { text: companyMock.name, href: `/companies/${companyMock.id}` },
          { text: 'Advisers' },
        ], 'companies/views/_deprecated/advisers', 'Mercury Trading Ltd')
      })

      context('when the company does have a DUNS number', () => {
        beforeEach(async () => {
          this.middlewareParameters = buildMiddlewareParameters({
            company: dnbCompanyMock,
            features: {
              'companies-advisers': true,
            },
          })

          nock(config.apiRoot)
            .get(`/v3/company/${dnbCompanyMock.id}/one-list-group-core-team`)
            .reply(200, coreTeamMock)

          await renderAdvisers(
            this.middlewareParameters.reqMock,
            this.middlewareParameters.resMock,
            this.middlewareParameters.nextSpy,
          )
        })

        commonTests([
          { text: dnbCompanyMock.name, href: `/companies/${dnbCompanyMock.id}` },
          { text: 'Advisers' },
        ], 'companies/views/advisers', 'One List Corp')
      })
    })

    context('when the feature flag is not enabled', () => {
      beforeEach(async () => {
        this.middlewareParameters = buildMiddlewareParameters({
          company: companyMock,
        })

        await renderAdvisers(
          this.middlewareParameters.reqMock,
          this.middlewareParameters.resMock,
          this.middlewareParameters.nextSpy,
        )
      })

      it('should not add breadcrumbs', () => {
        expect(this.middlewareParameters.resMock.breadcrumb).to.not.be.called
      })

      it('should not render the template', () => {
        expect(this.middlewareParameters.resMock.render).to.not.be.called
      })

      it('should call next with an error', () => {
        expect(this.middlewareParameters.nextSpy).to.have.been.calledOnce
        expect(this.middlewareParameters.nextSpy).to.be.calledWith(sinon.match.instanceOf(Error).and(sinon.match.has('message', 'Not Found')))
      })
    })
  })
})
