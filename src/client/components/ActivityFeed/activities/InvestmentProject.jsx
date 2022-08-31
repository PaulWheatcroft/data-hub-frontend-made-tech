import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Link from '@govuk-react/link'

import {
  Card,
  CardDetails,
  CardDetailsList,
  CardHeader,
  CardTable,
} from './card'

import { AdviserItemRenderer, ContactItemRenderer } from './card/item-renderers'
import { ACTIVITY_TYPE, ANALYTICS_ACCORDION_TYPE } from '../constants'

import CardUtils from './card/CardUtils'
import { currencyGBP, decimal } from '../../../utils/number-utils'
import CheckUserFeatureFlag from '../../CheckUserFeatureFlags'
import { CONTACT_ACTIVITY_FEATURE_FLAG } from '../../../../apps/companies/apps/activity-feed/constants'
import ActivityCardWrapper from './card/ActivityCardWrapper'
import ActivityCardLabels from './card/ActivityCardLabels'
import ActivityCardSubject from './card/ActivityCardSubject'
import ActivityCardMetadata from './card/ActivityCardMetadata'

const { format } = require('../../../utils/date')

const TITLES = {
  add: 'New investment project added',
}

export default class InvestmentProject extends React.PureComponent {
  static propTypes = {
    activity: PropTypes.object.isRequired,
    showDetails: PropTypes.bool.isRequired,
    showDnbHierarchy: PropTypes.bool.isRequired,
  }

  static canRender(activity) {
    return CardUtils.canRenderByTypes(activity, ACTIVITY_TYPE.InvestmentProject)
  }

  render() {
    const { activity, showDetails, showDnbHierarchy } = this.props

    const company = CardUtils.getCompany(activity)
    const type = get(activity, 'type')
    const title = TITLES[type.toLowerCase()]
    const url = get(activity, 'object.url')
    const name = get(activity, 'object.name')
    const investmentType = get(activity, 'object.dit:investmentType.name')
    const adviser = CardUtils.getAdviser(activity)
    const estimatedLandDate = format(
      get(activity, 'object.dit:estimatedLandDate')
    )
    const contacts = CardUtils.getContacts(activity)

    // Specific to Foreign direct investment (FDI) only
    const totalInvestment = currencyGBP(
      get(activity, 'object.dit:totalInvestment')
    )
    const foreignEquityInvestment = currencyGBP(
      get(activity, 'object.dit:foreignEquityInvestment')
    )
    const grossValueAdded = currencyGBP(
      get(activity, 'object.dit:grossValueAdded')
    )
    const numberNewJobs = decimal(get(activity, 'object.dit:numberNewJobs'))

    const published = get(activity, 'published')

    const metadata = [
      { label: 'Date', value: format(published) },
      { label: 'Investment Type', value: investmentType },
      {
        label: 'Added by',
        value: adviser
          ? [adviser].map((adviser, index) => (
              <span key={adviser.id}>
                {AdviserItemRenderer(adviser, index)}
              </span>
            ))
          : null,
      },
      {
        label: 'Estimated land date',
        value: estimatedLandDate,
      },
      {
        label: 'Company contact',
        value: contacts.map((contact, index) => (
          <span key={contact.id}>{ContactItemRenderer(contact, index)}</span>
        )),
      },
      { label: 'Total investment', value: totalInvestment },
      {
        label: 'Capital expenditure value',
        value: foreignEquityInvestment,
      },
      {
        label: 'Gross value added (GVA)',
        value: grossValueAdded,
      },
      { label: 'Number of jobs', value: numberNewJobs },
    ]

    return (
      <CheckUserFeatureFlag userFeatureFlagName={CONTACT_ACTIVITY_FEATURE_FLAG}>
        {(isFeatureFlagEnabled) =>
          !isFeatureFlagEnabled ? (
            <Card>
              <CardHeader
                company={showDnbHierarchy ? company : null}
                heading={<Link href={url}>{name}</Link>}
                startTime={published}
                blockText={`${title} - ${investmentType}`}
              />

              <CardDetails
                summary="Key details and people for this project"
                summaryVisuallyHidden={` ${name}`}
                showDetails={showDetails}
                analyticsAccordionType={
                  ANALYTICS_ACCORDION_TYPE.DATA_HUB_ACTIVITY
                }
              >
                <CardTable
                  rows={[
                    { header: 'Investment Type', content: investmentType },
                    {
                      header: 'Added by',
                      content: adviser ? (
                        <CardDetailsList
                          itemRenderer={AdviserItemRenderer}
                          items={[adviser]}
                        />
                      ) : null,
                    },
                    {
                      header: 'Estimated land date',
                      content: estimatedLandDate,
                    },
                    {
                      header: 'Company contact(s)',
                      content: (
                        <CardDetailsList
                          itemRenderer={ContactItemRenderer}
                          items={contacts}
                        />
                      ),
                    },
                    { header: 'Total Investment', content: totalInvestment },
                    {
                      header: 'Capital expenditure value',
                      content: foreignEquityInvestment,
                    },
                    {
                      header: 'Gross value added (GVA)',
                      content: grossValueAdded,
                    },
                    { header: 'Number of new jobs', content: numberNewJobs },
                  ]}
                />
              </CardDetails>
            </Card>
          ) : (
            <ActivityCardWrapper dataTest="investment-activity">
              <ActivityCardLabels
                theme="Investment"
                service="Project - FDI"
                kind="New Investment Project"
              />
              <ActivityCardSubject>{name}</ActivityCardSubject>
              <ActivityCardMetadata metadata={metadata} />
            </ActivityCardWrapper>
          )
        }
      </CheckUserFeatureFlag>
    )
  }
}
