const { keys, forEach, isObject } = require('lodash')
const qs = require('qs')

const selectors = require('../../../selectors')

const assertKeyValueTable = (dataTest, expected) => {
  forEach(keys(expected), (key, i) => {
    const rowNumber = i + 1

    if (expected[key] === null) {
      cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
        'have.text',
        key
      )
    } else if (expected[key].href) {
      cy.get(selectors.keyValueTable(dataTest).keyCell(rowNumber)).should(
        'have.text',
        key
      )
      cy.get(selectors.keyValueTable(dataTest).valueCellLink(rowNumber)).should(
        'have.attr',
        'href',
        expected[key].href
      )
      cy.get(selectors.keyValueTable(dataTest).valueCellLink(rowNumber)).should(
        'have.text',
        expected[key].name
      )
    } else {
      cy.get(selectors.keyValueTable(dataTest).keyCell(rowNumber)).should(
        'have.text',
        key
      )
      cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
        'have.text',
        expected[key]
      )
    }
  })
}

const assertValueTable = (dataTest, expected) => {
  forEach(expected, (expectedValue, i) => {
    const rowNumber = i + 1
    cy.get(selectors.keyValueTable(dataTest).valueCell(rowNumber)).should(
      'have.text',
      expectedValue
    )
  })
}

const assertSummaryTable = ({ dataTest, heading, showEditLink, content }) => {
  const summaryTableSelector = `[data-test="${dataTest}"]`

  if (heading) {
    cy.get(summaryTableSelector).find('caption').should('contain', heading)
  }
  cy.get(summaryTableSelector)
    .contains('Edit')
    .should(showEditLink ? 'be.visible' : 'not.exist')

  if (typeof content !== 'undefined') {
    Array.isArray(content)
      ? assertValueTable(dataTest, content)
      : assertKeyValueTable(dataTest, content)
  }
}

/**
 * @description Asserts the presence of breadcrumbs with minimal knowledge about
 * implementation details e.g. class names and ids.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 * @example
 * // Asserts that breadcrumbs: Home > Foo > Bar > Baz exist and that they have
 * // the expected texts and hrefs.
 * it('Should render foo > bar > baz breadcrumbs' =>
 *   assertBreadcrumbs({
 *     'Home': '/',
 *     'Foo': '/foo',
 *     'Bar': '/bar',
 *     'Baz': undefined,
 *   })
 * )
 */
const assertBreadcrumbs = (specs) => {
  const entries = Object.entries(specs)
  cy.contains(Object.keys(specs).join(''))
    .children('li')
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedText, expectedHref] = entries[i]
      cy.get(x)
        .contains(expectedText)
        .invoke('attr', 'href')
        .should('eq', expectedHref || undefined)
    })
}

/**
 * @description Same as assertBreadcrumbs but already wrapped in an `it` block.
 * @param {Object} specs - A map of expected breadcrumb item labels to hrefs.
 */
const testBreadcrumbs = (specs) =>
  it('should render breadcrumbs', () => assertBreadcrumbs(specs))

const assertFieldUneditable = ({ element, label, value = null }) =>
  cy
    .wrap(element)
    .find('label')
    .should('have.text', label)
    .parent()
    .then(($el) => value && cy.wrap($el).should('contain', value))

const assertFieldSelect = ({
  element,
  label,
  emptyOption,
  value,
  optionsCount,
}) =>
  cy
    .wrap(element)
    .as('fieldSelect')
    .then(() => {
      label &&
        cy.get('@fieldSelect').find('label').first().should('have.text', label)

      emptyOption &&
        cy
          .get('@fieldSelect')
          .find('option')
          .first()
          .should('have.text', emptyOption)

      optionsCount &&
        cy
          .get('@fieldSelect')
          .find('option')
          .should('have.length', optionsCount)

      value &&
        cy
          .get('@fieldSelect')
          .find('option[selected]')
          .should('have.text', value)
    })

/**
 * @description Asserts a list of <select> options
 * @param {String} element - the CSS <select> selector
 * @param {Array} options - an array of options to assert
 * @example
 * it('Should assert a list of <select> options' =>
 *   assertSelectOptions({
 *     'element': 'select option',
 *     'options': [
 *        {
 *          value: "1",
 *          label: "Commitment to invest",
 *        },
 *        {
 *          value: "2",
 *          label: "FDI",
 *        },
 *        {
 *          "value": "3",
 *          "label": "Non-FDI",
 *        }
 *      ]
 *   })
 * )
 */
const assertSelectOptions = (element, expectedOptions) =>
  cy.get(element).then((options) => {
    expect(
      [...options].map((o) => ({
        value: o.value,
        label: o.label,
      }))
    ).to.deep.eq(expectedOptions)
  })

const assertFieldAddAnother = ({
  element,
  label,
  values,
  emptyOption,
  optionsCount = 0,
}) =>
  cy
    .wrap(element)
    .as('fieldAddAnother')
    .then(
      () =>
        label &&
        cy
          .get('@fieldAddAnother')
          .find('label')
          .first()
          .should('have.text', label)
    )
    .parent()
    .children('div')
    .each((item, i) => {
      assertFieldSelect({
        element: item,
        emptyOption,
        optionsCount,
        value: values && values[i] && values[i].name,
      })
    })

const assertFieldRadios = ({ element, label, value, optionsCount }) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('label')
    .first()
    .should('have.text', label)
    .parent()
    .find('input')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
          .should('have.text', value)
    )

// As part of the accessibility work, a sample of pages have been refactored to use legends instead of labels.
//  Use this assertion for radios which have legends applied.
const assertFieldRadiosWithLegend = ({
  element,
  legend,
  value,
  optionsCount,
}) =>
  cy
    .wrap(element)
    .as('fieldRadio')
    .find('legend')
    .first()
    .should('have.text', legend)
    .parent()
    .find('input')
    .should('have.length', optionsCount)
    .then(
      () =>
        value &&
        cy
          .get('@fieldRadio')
          .find('input:checked')
          .next()
          .should('have.text', value)
    )

const assertFieldCheckbox = ({ element, label, value, checked }) => {
  cy.wrap(element)
    .as('fieldCheckbox')
    .find('label')
    .should('contain.text', label)

  cy.get('@fieldCheckbox')
    .find('input')
    .should('have.attr', 'value', value)
    .should(checked ? 'be.checked' : 'not.be.checked')
}

const assertFieldTypeahead = ({
  element,
  label,
  value,
  placeholder = '',
  hint = '',
  isMulti = true,
}) =>
  cy.wrap(element).should(($typeahead) => {
    placeholder &&
      expect($typeahead.find('input')).to.have.attr('placeholder', placeholder)

    label
      ? expect($typeahead.find('label')).to.contain(label)
      : expect($typeahead.find('label')).to.not.exist

    isMulti
      ? value && expect($typeahead).to.contain(value)
      : value && expect($typeahead.find('input')).to.have.attr('value', value)

    hint && expect($typeahead).to.contain(hint)
  })

const assertFieldSingleTypeahead = (props) =>
  assertFieldTypeahead({ ...props, isMulti: false })

const assertFieldInput = ({
  element,
  label,
  hint = undefined,
  value = undefined,
}) =>
  cy
    .wrap(element)
    .find('label')
    .should('have.text', label)
    .next()
    .then(
      ($el) =>
        hint &&
        cy
          .wrap($el)
          .should('have.text', hint || '')
          .next()
    )
    .find('input')
    .then(
      ($el) =>
        value && cy.wrap($el).should('have.attr', 'value', String(value) || '')
    )

const assertFieldHidden = ({ element, name, value }) =>
  cy.wrap(element).should('have.attr', 'name', name).should('have.value', value)

const assertFieldTextarea = ({ element, label, hint, value }) =>
  cy
    .wrap(element)
    .find('label')
    .should('contain', label)
    .next()
    .then(
      ($el) =>
        hint &&
        cy
          .wrap($el)
          .should('have.text', hint || '')
          .next()
    )
    .find('textarea')
    .then(($el) => value ?? cy.wrap($el).should('have.text', value || ''))

const assertFieldAddress = ({ element, hint = null, value = {} }) => {
  const isUKBased = value.country.name === 'United Kingdom'
  const isUSBased = value.country.name === 'United States'
  const isCanadianBased = value.country.name === 'Canada'
  const hasStateField = isUSBased || isCanadianBased
  const postcodeLabel = () => {
    if (isUSBased) return 'ZIP code (optional)'
    if (isCanadianBased) return 'Postal code (optional)'
    if (isUKBased) return 'Postcode'
    return 'Postcode (optional)'
  }
  if (isUKBased) {
    cy.contains('Find UK address').should('be.visible').and('match', 'button')
  }
  let addressElements = [
    {
      assert: ({ element }) =>
        cy.wrap(element).should('have.text', 'Trading address'),
    },
    hint && {
      assert: ({ element }) => cy.wrap(element).should('have.text', hint),
    },
    {
      label: 'Country',
      value: value.country.name,
      assert: assertFieldUneditable,
    },
    isUKBased && {
      label: postcodeLabel(),
      value: value.postcode,
      assert: assertFieldInput,
    },
    {
      label: 'Address line 1',
      value: value.line_1,
      assert: assertFieldInput,
    },
    {
      label: 'Address line 2 (optional)',
      value: value.line_2,
      assert: assertFieldInput,
    },
    {
      label: 'Town or city',
      value: value.town,
      assert: assertFieldInput,
    },
    !isUSBased &&
      !isCanadianBased && {
        label: 'County (optional)',
        value: value.county,
        assert: assertFieldInput,
      },
    hasStateField && {
      label: isCanadianBased ? 'Province' : 'State',
      value: value.area.name,
      assert: assertFieldSelect,
    },
    !isUKBased && {
      label: postcodeLabel(),
      value: value.postcode,
      assert: assertFieldInput,
    },
  ].filter(isObject)

  cy.wrap(element)
    .as('field')
    .get('fieldset')
    .children()
    .each((item, i) => {
      if (addressElements[i]) {
        const { assert, ...params } = addressElements[i]
        assert({ element: item, ...params })
      }
    })
}

const assertFieldDate = ({ element, label, value = {} }) => {
  const inputs = element.find('input')

  expect(element).to.contain.text(label)
  expect(element).to.contain.text('Day')
  expect(element).to.contain.text('Month')
  expect(element).to.contain.text('Year')

  value.day && expect(inputs[0]).to.have.value(value.day)
  value.month && expect(inputs[1]).to.have.value(value.month)
  value.year && expect(inputs[2]).to.have.value(value.year)
}

const assertFieldDateShort = ({ element, label, value = {} }) => {
  const labels = element.find('label')
  const inputs = element.find('input')

  label && expect(labels[0]).to.have.text(label)

  expect(labels[1]).to.have.text('Month')
  expect(labels[2]).to.have.text('Year')

  value.month && expect(inputs[0]).to.have.value(value.month)
  value.year && expect(inputs[1]).to.have.value(value.year)
}

const assertFormActions = ({ element, buttons }) =>
  cy
    .wrap(element)
    .children()
    .each((element, i) => {
      cy.wrap(element).should('have.text', buttons[i]).should('match', 'button')
    })

const assertFormFields = (formElement, specs) =>
  formElement.children().each((element, i) => {
    if (specs[i]) {
      const spec = specs[i]
      if (spec instanceof Function) {
        spec(element)
      } else {
        const { assert, ...params } = spec
        assert({ element, ...params })
      }
    }
  })

const assertDetails = ({ element, summary, content }) =>
  cy
    .wrap(element)
    .find('summary')
    .should('have.text', summary)
    .next()
    .should('have.text', content)

const assertLocalHeader = (header) => {
  cy.get(selectors.localHeader).contains(header)
}

const assertTabbedLocalNav = (nav) => {
  cy.get(selectors.tabbedLocalNav).contains(nav)
}

const assertSummaryList = (listElement, specs) => {
  const entries = Object.entries(specs)
  cy.wrap(listElement)
    .children()
    .should('have.length', entries.length)
    .each((x, i) => {
      const [expectedLabel, expectedValue] = entries[i]
      cy.get(x).find('dt').should('have.text', expectedLabel)
      cy.get(x).find('dd').should('have.text', expectedValue)
    })
}

const assertAriaTablistTabSelected = (tabListLabel, tabLabel) =>
  cy
    .getDhTablistTab(tabListLabel, tabLabel)
    .should('have.attr', 'aria-selected', 'true')

const assertFormButtons = ({ submitText, cancelText, cancelLink }) => {
  cy.contains('button', submitText)
  cy.contains('a', cancelText).should('have.attr', 'href', cancelLink)
}

/**
 * Assert that a checkbox is checked or unchecked
 */
const assertCheckboxGroupOption = ({ element, value, checked = true }) => {
  const checkbox = cy.get(element).find(`input[value="${value}"]`)
  if (checked) {
    checkbox.should('be.checked')
  } else {
    checkbox.should('not.be.checked')
  }
}

/**
 * Assert that none of the options in a checkbox group are selected
 */
const assertCheckboxGroupNoneSelected = (element) => {
  cy.get(element)
    .find('input')
    .each((child) => cy.wrap(child).should('not.be.checked'))
}

/**
 * Asserts that a typeahead `element` has the given `legend` and `placeholder`
 */
const assertTypeaheadHints = ({
  element,
  legend,
  label,
  placeholder,
  hintText,
}) => {
  cy.get(element)
    .find(`${label ? 'label' : 'legend'}`)
    .should('have.text', label ? label : legend)
  cy.get(element).find('input').should('have.attr', 'placeholder', placeholder)
  hintText && cy.get(element).find('span').should('contain', hintText)
}

/**
 * Asserts that the typeahead `element` has the `expectedOption` selected
 */
const assertTypeaheadOptionSelected = ({ element, expectedOption }) => {
  cy.get(element).should('contain', expectedOption)
}

/**
 * Asserts that a single-select typeahead `element` has the `expectedOption` selected
 */
const assertSingleTypeaheadOptionSelected = ({ element, expectedOption }) => {
  cy.get(element).find('input').should('have.attr', 'value', expectedOption)
}

/**
 * Asserts that a chip indicator exists in the specified position
 */
const assertChipExists = ({ label, position }) => {
  cy.get(`#filter-chips button:nth-child(${position})`).should((el) => {
    expect(el.text()).to.contain(label)
  })
}

/**
 * Asserts there are no chips
 */
const assertChipsEmpty = () => {
  cy.get('[data-test=filter-chips]').should('be.empty')
}

/**
 * Asserts the field is empty
 */
const assertFieldEmpty = (element) => {
  cy.get(element).should('have.value', '')
}

/**
 * Asserts the key-value pair are defined within the query params
 */
const assertQueryParams = (key, value) => {
  cy.url().should(
    'include',
    qs.stringify({
      [key]: value,
    })
  )
}

/**
 * Asserts the key-value pair are defined within the query params
 */
const assertNotQueryParams = (key, value) => {
  cy.url().should(
    'not.include',
    qs.stringify({
      [key]: value,
    })
  )
}

/**
 * Assert the expected payload to the API
 */

const assertPayload = (apiRequest, expectedParams) => {
  cy.wait(apiRequest).then(({ request }) => {
    expect(request.body).to.deep.equal(expectedParams)
  })
}

/**
 * Assert that the label and value exist on the date input
 */

const assertDateInput = ({ element, label, value }) => {
  cy.get(element)
    .find('label')
    .should('contain', label)
    .next()
    .should('have.attr', 'value', value)
}

/**
 * Assert error summary passing in a list of errors as as an array
 */
const assertErrorSummary = (errors) => {
  cy.contains('h2', 'There is a problem')
    .next()
    .should('have.text', errors.join(''))
}

/**
 * Assert by selector if it is visible
 */
const assertVisible = (selector) => {
  cy.get(selector).should('be.visible')
}

/**
 * Assert by selector if it does not exist
 */
const assertNotExists = (selector) => {
  cy.get(selector).should('not.exist')
}

/**
 * Assert if the text is visible
 */
const assertTextVisible = (text) => {
  cy.contains(text).should('be.visible')
}

/**
 * Assert url is contained in current url
 */
const assertUrl = (url) => {
  cy.url().should('contain', url)
}

/**
 * Assert flash message is contained
 */
const assertFlashMessage = (message) => {
  cy.get('[data-test="status-message"]').contains(message)
}

/**
 * Assert that a given param is either present or not present in a URL
 */
const assertParamContainedInUrl = (xhr, param) => {
  expect(xhr.response.url).to.contain(param)
}

const assertParamNotContainedInUrl = (xhr, param) => {
  expect(xhr.response.url).to.not.contain(param)
}

/**
 * Assert that the body of an intercepted request is as expected
 */
const assertRequestBody = (xhr, expectedBody) => {
  expect(xhr.request.body).to.deep.equal(expectedBody)
}

/**
 * Assert that the error dialog contains a task name and error message
 */
const assertErrorDialog = (taskName, errorMessage) => {
  const getErrorDialog = () => {
    return cy.get('[data-test="error-dialog"]')
  }

  getErrorDialog().should('exist')
  getErrorDialog().contains('h2', taskName)
  getErrorDialog().contains('p', errorMessage)
}

/**
 * Assert an endpoint value where a wait has been setup
 * @@param endPointAlias defined with wait and no need to assign the @ value
 * @@param assertCallback callback function to assert
 */
const assertAPIRequest = (endPointAlias, assertCallback) =>
  cy.wait(`@${endPointAlias}`).then((xhr) => assertCallback(xhr))

module.exports = {
  assertKeyValueTable,
  assertValueTable,
  assertSummaryTable,
  assertBreadcrumbs,
  testBreadcrumbs,
  assertFieldTypeahead,
  assertFieldSingleTypeahead,
  assertFieldInput,
  assertFieldTextarea,
  assertFieldSelect,
  assertSelectOptions,
  assertFieldAddAnother,
  assertFieldRadios,
  assertFieldRadiosWithLegend,
  assertFieldCheckbox,
  assertFieldAddress,
  assertFieldUneditable,
  assertFormActions,
  assertFieldDate,
  assertFieldDateShort,
  assertFieldHidden,
  assertFormFields,
  assertDetails,
  assertLocalHeader,
  assertTabbedLocalNav,
  assertSummaryList,
  assertAriaTablistTabSelected,
  assertFormButtons,
  assertCheckboxGroupOption,
  assertCheckboxGroupNoneSelected,
  assertTypeaheadHints,
  assertSingleTypeaheadOptionSelected,
  assertTypeaheadOptionSelected,
  assertChipExists,
  assertChipsEmpty,
  assertFieldEmpty,
  assertQueryParams,
  assertNotQueryParams,
  assertPayload,
  assertDateInput,
  assertErrorSummary,
  assertVisible,
  assertNotExists,
  assertTextVisible,
  assertUrl,
  assertFlashMessage,
  assertParamContainedInUrl,
  assertParamNotContainedInUrl,
  assertRequestBody,
  assertErrorDialog,
  assertAPIRequest,
}
