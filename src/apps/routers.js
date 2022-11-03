const router = require('express').Router()
const fs = require('fs')

const { setHomeBreadcrumb } = require('./middleware')

const subApps = fs.readdirSync(__dirname, { withFileTypes: true })

const appsRouters = []

const reactRoutes = [
  '/companies',
  '/contacts',
  '/events',
  '/interactions',
  '/reminders',
  '/reminders/investments-estimated-land-date',
  '/reminders/investments-no-recent-interaction',
  '/reminders/investments-outstanding-propositions',
  '/reminders/settings',
  '/reminders/settings/investments-estimated-land-date',
  '/reminders/settings/investments-no-recent-interaction',
  '/reminders/settings/exports-no-recent-interactions',
  '/omis',
  '/access-denied',
]

reactRoutes.forEach((path) => {
  router.get(path, async (req, res, next) => {
    try {
      res.render('react')
    } catch (error) {
      next(error)
    }
  })
})

subApps.forEach((subAppDir) => {
  if (subAppDir.isDirectory() && !subAppDir.name.startsWith('__')) {
    const subApp = require(`./${subAppDir.name}`)
    if (subApp.mountpath) {
      appsRouters.push(
        router.use(
          subApp.mountpath,
          setHomeBreadcrumb(subApp.displayName),
          subApp.router
        )
      )
    } else if (subApp.router) {
      appsRouters.push(router.use(subApp.router))
    }
  }
})

module.exports = appsRouters
