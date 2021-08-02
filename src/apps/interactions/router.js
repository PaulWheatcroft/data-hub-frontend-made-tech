const router = require('express').Router()

const {
  DEFAULT_COLLECTION_QUERY,
  APP_PERMISSIONS,
  QUERY_FIELDS,
  QUERY_DATE_FIELDS,
} = require('./constants')
// TODO: After the React collection list has gone live and the users are
// happy we must remove the commented out code below
// const { renderInteractionList } = require('./controllers/list')
const {
  exportCollection,
} = require('../../modules/search/middleware/collection')
const { getRequestBody } = require('../../middleware/collection')

const { setDefaultQuery, handleRoutePermissions } = require('../middleware')
// TODO: After the React collection list has gone live and the users are
// happy we must remove the commented out code below
// const {
//   getInteractionCollection,
//   getInteractionsRequestBody,
//   getInteractionSortForm,
// } = require('./middleware/collection')

const subAppRouter = require('./router.sub-app')

router.use(handleRoutePermissions(APP_PERMISSIONS))
// TODO: After the React collection list has gone live and the users are
// happy we must remove the commented out code below
// router.get(
//   '/',
//   setDefaultQuery(DEFAULT_COLLECTION_QUERY),
//   getInteractionsRequestBody,
//   getInteractionCollection,
//   getInteractionSortForm,
//   renderInteractionList
// )

router.get(
  '/export',
  setDefaultQuery(DEFAULT_COLLECTION_QUERY),
  getRequestBody(QUERY_FIELDS, QUERY_DATE_FIELDS),
  exportCollection('interaction')
)

router.get('/', (req, res, next) => {
  try {
    const { user } = req.session
    return res.render('interactions/views/interactions', {
      props: { currentAdviserId: user.id },
    })
  } catch (error) {
    next(error)
  }
})

router.use(subAppRouter)

module.exports = router
