const { get } = require('lodash')

const labels = require('../labels')
const urls = require('../../../lib/urls')

const { addressToString } = require('../../../common/addresses')
const { formatLongDate, formatMediumDateTime } = require('../../../common/date')

module.exports = function transformCompanyToListItem({
  id,
  name,
  sector,
  uk_region,
  trading_names,
  address,
  modified_on,
  headquarter_type,
  global_headquarters,
  latest_interaction_date,
} = {}) {
  if (!id) {
    return
  }

  const metadata = [
    {
      label: 'Sector',
      value: get(sector, 'name'),
    },
    {
      label: 'Global HQ',
      value: get(global_headquarters, 'name'),
    },
    {
      label: labels.address.companyAddress,
      value: addressToString(address),
    },
  ]

  if (trading_names && trading_names.length) {
    metadata.push({
      label: labels.hqLabels.trading_names,
      value: trading_names.join(', '),
    })
  }

  if (latest_interaction_date) {
    metadata.push({
      label: 'Last interaction date',
      value: formatLongDate(latest_interaction_date),
    })
  }

  if (headquarter_type) {
    metadata.push({
      label: 'Headquarter type',
      value: labels.hqLabels[get(headquarter_type, 'name')],
    })
  }

  const badges = [
    { text: get(address, 'country.name') },
    { text: get(uk_region, 'name') },
    { text: labels.hqLabels[get(headquarter_type, 'name')] },
  ].filter((item) => item.text)

  return {
    id,
    subheading: `Updated on ${formatMediumDateTime(modified_on)}`,
    headingText: name,
    headingUrl: urls.companies.detail(id),
    badges,
    metadata: metadata.filter((item) => item.value),
    type: 'company',
  }
}
