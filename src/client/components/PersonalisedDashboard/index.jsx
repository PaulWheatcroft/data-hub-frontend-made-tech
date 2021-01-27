import PropTypes from 'prop-types'
import React from 'react'
import GridRow from '@govuk-react/grid-row'
import GridCol from '@govuk-react/grid-col'

import Aside from './Aside.jsx'
import Main from './Main.jsx'

import {
  UserDetails,
  InvestmentReminders,
  InvestmentProjectSummary,
  Search,
  InvestmentUpcomingDates,
  DashboardTabs,
} from '../../components'

const PersonalisedDashboard = ({ id }) => (
  <GridRow data-test="dashboard">
    <GridCol setWidth="one-third">
      <Aside>
        <UserDetails />
        <InvestmentReminders />
        <InvestmentProjectSummary />
      </Aside>
    </GridCol>
    <GridCol setWidth="two-thirds">
      <Main>
        <Search />
        <InvestmentUpcomingDates />
        <DashboardTabs id={id} />
      </Main>
    </GridCol>
  </GridRow>
)

PersonalisedDashboard.propTypes = {
  id: PropTypes.string.isRequired,
}

export default PersonalisedDashboard
