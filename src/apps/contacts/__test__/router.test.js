const router = require('../router')

describe('Contacts router', () => {
  it('should define contacts routes', () => {
    const paths = router.stack.filter((r) => r.route).map((r) => r.route.path)
    expect(paths).to.deep.equal([
      '/contacts?archived[0]=false&sortby=modified_on:desc&page=1',
      ['/create', '/:contactId/edit'],
      '/export',
      '/:contactId',
      '/:contactId/details',
      '/:id/unarchive',
      '/:contactId/audit',
      '/:contactId/documents',
      '/:contactId/activity/data',
    ])
  })
})
