const urls = require('../../../../../../lib/urls')

function renderProjects(req, res) {
  const { company, returnUrl, dnbRelatedCompaniesCount, features } = res.locals
  const hideAddInvestmentButtonEnabled =
    features['investment-hide-add-investement-button-for-uk'] ?? false
  // console.debug(hideAddInvestmentButtonEnabled, isUKCompany)
  res.locals.title = `Investments - ${company.name} - Companies`

  res.render('companies/apps/investments/projects/views/list', {
    props: {
      company,
      breadcrumbs: [
        { link: urls.dashboard(), text: 'Home' },
        {
          link: urls.companies.index(),
          text: 'Companies',
        },
        { link: urls.companies.detail(company.id), text: company.name },
        { text: 'Investment' },
      ],
      returnUrl,
      dnbRelatedCompaniesCount,
      hideAddInvestmentButtonEnabled,
    },
  })
}

module.exports = renderProjects
