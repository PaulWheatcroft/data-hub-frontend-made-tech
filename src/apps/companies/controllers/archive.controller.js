const { archiveCompany, unarchiveCompany, getDitCompany } = require('../repository')
const { buildCompanyUrl } = require('../services/data.service')

async function postArchiveCompany (req, res, next) {
  try {
    const company = await getDitCompany(req.session.token, req.params.id)
    const url = buildCompanyUrl(company)
    const reason = (req.body.archived_reason !== 'Other') ? req.body.archived_reason : req.body.archived_reason_other

    if (reason.length > 0) {
      await archiveCompany(req.session.token, company.id, reason)
      req.flash('success-message', 'Updated company record')
    } else {
      req.flash('error-message', 'Unable to archive company, no reason given')
    }

    res.redirect(url)
  } catch (error) {
    next(error)
  }
}

async function getUnarchiveCompany (req, res, next) {
  try {
    const company = await getDitCompany(req.session.token, req.params.id)
    const url = buildCompanyUrl(company)
    await unarchiveCompany(req.session.token, company.id)
    req.flash('success-message', 'Updated company record')
    res.redirect(url)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  postArchiveCompany,
  getUnarchiveCompany,
}
