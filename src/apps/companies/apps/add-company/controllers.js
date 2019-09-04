const { searchDnbCompanies } = require('../../../../modules/search/services')
const { saveDnbCompany } = require('../../repos')

async function renderAddCompanyForm (req, res, next) {
  try {
    res
      .breadcrumb('Add company')
      .render('companies/apps/add-company/views/client-container')
  } catch (error) {
    next(error)
  }
}

async function postSearchDnbCompanies (req, res, next) {
  try {
    const results = await searchDnbCompanies({
      token: req.session.token,
      requestBody: req.body,
    })

    res.json(results)
  } catch (error) {
    next(error)
  }
}

async function postAddDnbCompany (req, res, next) {
  try {
    const company = await saveDnbCompany(req.session.token, req.body.duns_number)
    req.flash('success', 'Company created')

    res.json(company)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderAddCompanyForm,
  postSearchDnbCompanies,
  postAddDnbCompany,
}
