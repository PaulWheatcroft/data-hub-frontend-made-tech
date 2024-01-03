/**
 * This transformer is used by the homepage search, which is
 * written in Nunjucks. Once this has been reactified, we can
 * put this back into the main transformers file.
 */

const { formatMonthYearDate } = require('../../../utils/date')

const MONTH_DATE_FIELD_LIST = [
  'estimated_land_date_before',
  'estimated_land_date_after',
  'actual_land_date_before',
  'actual_land_date_after',
]

const transformLandDateFilters = (params) => {
  // The API only accepts yyyy-MM-dd format, so month-year filters have to be updated
  MONTH_DATE_FIELD_LIST.forEach((field) => {
    if (field in params) {
      params[field] = formatMonthYearDate(params[field])
    }
  })
  return params
}

module.exports = { transformLandDateFilters }
