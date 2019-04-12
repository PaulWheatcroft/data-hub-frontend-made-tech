const { get, map } = require('lodash')

const GLOBAL_NAV_ITEMS = require('../apps/global-nav-items')
const logger = require('../../config/logger')
const config = require('../../config')
const { version } = require('../../package.json')
const { filterNonPermittedItem } = require('../modules/permissions/filters')
const { buildNavObject } = require('../apps/builders')

let webpackManifest = {}

try {
  webpackManifest = require(`${config.buildDir}/manifest.json`)
} catch (err) {
  logger.error('Manifest file is not found. Ensure assets are built.')
}

module.exports = function locals (req, res, next) {
  const baseUrl = `${(req.encrypted ? 'https' : req.protocol)}://${req.get('host')}`
  const userPermissions = get(res, 'locals.user.permissions')
  const userProfile = config.oauth.bypassSSO ? null : get(req.session, 'userProfile')
  const permittedApplications = get(userProfile, 'permitted_applications', [])

  res.locals = Object.assign({}, res.locals, {
    APP_VERSION: version,
    BASE_URL: baseUrl,
    CANONICAL_URL: baseUrl + req.path,
    ORIGINAL_URL: baseUrl + req.originalUrl,
    CURRENT_PATH: req.path,
    ARCHIVED_DOCUMENT_BASE_URL: config.archivedDocumentsBaseUrl,
    GOOGLE_TAG_MANAGER_KEY: config.googleTagManagerKey,
    IS_XHR: req.xhr,
    QUERY: req.query,
    GLOBAL_NAV_ITEMS: GLOBAL_NAV_ITEMS
      .filter(filterNonPermittedItem(userPermissions))
      .map(navItem => buildNavObject(req, navItem, permittedApplications, config.oauth.bypassSSO)),

    getMessages () {
      return req.flash()
    },

    getPageTitle () {
      const items = res.breadcrumb().map(item => item.text)
      const title = res.locals.title

      if (title) {
        if (items.length === 1) {
          return [title]
        }

        items.pop()
        items.push(title)
      }

      return items.reverse().slice(0, -1)
    },

    getBreadcrumbs () {
      const breadcrumbs = res.breadcrumb()

      return map(breadcrumbs, ({ text, href }, i) => {
        return {
          text,
          href: i === breadcrumbs.length - 1 ? null : href,
        }
      })
    },

    getAssetPath (asset) {
      const assetsUrl = config.assetsHost || baseUrl
      const webpackAssetPath = webpackManifest[asset]

      if (webpackAssetPath) {
        return `${assetsUrl}/${webpackAssetPath}`
      }

      return `${assetsUrl}/${asset}`
    },

    getLocal (key) {
      return res.locals[key]
    },

    translate (key) {
      return req.translate(key)
    },
  })
  next()
}
