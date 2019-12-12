const buildMiddlewareParameters = require('../../../../../../test/unit/helpers/middleware-parameters-builder')
const companyMock = require('../../../../../../test/unit/data/companies/company-v4.json')
const urls = require('../../../../../../src/lib/urls')

const { renderEditHistory } = require('../controller')

describe('rendering Edit History', () => {
  context('when "Edit History" renders successfully', () => {
    let middlewareParams
    beforeEach(async () => {
      middlewareParams = buildMiddlewareParameters({
        company: companyMock,
      })
      await renderEditHistory(
        middlewareParams.reqMock,
        middlewareParams.resMock,
        middlewareParams.nextSpy,
      )
    })

    it('should render the add company form template with fields', () => {
      const expectedTemplate = 'companies/apps/edit-history/views/client-container'
      expect(middlewareParams.resMock.render).to.be.calledOnceWithExactly(expectedTemplate, {
        props: {},
      })
    })

    it('should add 3 breadcrumbs', () => {
      expect(middlewareParams.resMock.breadcrumb.args).to.deep.equal([
        ['Mercury Ltd', urls.companies.detail('a73efeba-8499-11e6-ae22-56b6b6499611')],
        ['Business details', urls.companies.businessDetails('a73efeba-8499-11e6-ae22-56b6b6499611')],
        ['Edit History'],
      ])
    })

    it('should not call next() with an error', () => {
      expect(middlewareParams.nextSpy).to.not.have.been.called
    })
  })

  context('when "Edit History" errors', async () => {
    let middlewareParams

    before(async () => {
      middlewareParams = buildMiddlewareParameters({
        company: companyMock,
      })
      middlewareParams.resMock.render.throws()

      await renderEditHistory(
        middlewareParams.reqMock,
        middlewareParams.resMock,
        middlewareParams.nextSpy
      )
    })

    it('should not call render', () => {
      expect(middlewareParams.resMock.render).to.be.thrown
    })

    it('should call next in the catch', () => {
      expect(middlewareParams.nextSpy).to.be.calledOnce
    })
  })
})
