const renderOpportunityView = (req, res, next) => {
  try {
    res.render('investments/views/opportunity', {
      props: {
        opportunityId: req.params.opportunityId,
      },
    })
  } catch (error) {
    next(error)
  }
}

const renderOpportunityStatusView = (req, res, next) => {
  try {
    res.render('investments/views/opportunity-status', {
      props: {
        opportunityId: req.params.opportunityId,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  renderOpportunityView,
  renderOpportunityStatusView,
}
