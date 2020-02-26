module.exports = {
  tradingName: 'input[name="trading_names"]',
  vatNumber: 'input[name="vat_number"]',
  annualTurnover: 'input[name="turnover_range"]',
  numberOfEmployees: 'input[name="employee_range"]',
  website: 'input[name="website"]',
  businessDescription: 'input[name="description"]',
  address: {
    postcodeLookupButton: 'button:contains("Find UK address")',
    line1: 'input[name="address1"]',
    line2: 'input[name="address2"]',
    town: 'input[name="city"]',
    county: 'input[name="county"]',
    postcode: 'input[name="postcode"]',
  },
  registeredAddressLegend: 'fieldset legend:contains("Registered address")',
  region: 'select#uk_region',
  sector: 'select#sector',
  needToEditTheSector: 'details[data-test="sector-details"]',
  businessHierarchy: 'input[name="headquarter_type"]',
  globalHqHierarchy: '#field-headquarter_type > div > div:nth-child(5)',
  notHqHierarchy: '#field-headquarter_type > div > div:nth-child(2)',
  needToEditTheHeadquarterType: 'details[data-test="headquarter_type-details"]',
  saveButton: 'button:contains("Submit")',
  backLink: 'a:contains("Return without saving")',
}
