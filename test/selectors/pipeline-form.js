module.exports = {
  name: 'input[name="name"]',
  status: {
    prospect: 'input[value=leads]',
    active: 'input[value="in_progress"]',
    won: 'input[value="win"]',
  },
  likelihood: {
    low: 'input[value="1"]',
  },
  value: 'input[name="export_value"]',
  fields: {
    name: '#field-name',
    status: '#field-category',
    likelihood: '#field-likelihood',
    sector: '#field-sector',
    contact: '#field-contact',
    value: '#field-export_value',
  },
}
