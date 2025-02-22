const adviserResult = require('../../../sandbox/fixtures/autocomplete-adviser-list.json')

/**
 * Enter `input` into an advisers typeahead `element` and select the first result
 *
 * This waits for the adviser api request to complete before selecting the
 * first option, but has a mocked intercepted adviser response to circumvent
 * network latency.
 */
export const selectFirstAdvisersTypeaheadOption = ({
  element,
  input,
  mockAdviserResponse = true,
}) =>
  cy.get(element).within(() => {
    cy.intercept(
      `/api-proxy/adviser/?*${input.replace(' ', '+')}*`,
      mockAdviserResponse
        ? {
            body: adviserResult,
          }
        : undefined
    ).as('adviserResults')
    cy.get('input').clear().type(input)
    cy.wait('@adviserResults')
    cy.get('[data-test="typeahead-menu-option"]').contains(input, {
      matchCase: false,
      timeout: 120000,
    })
    cy.get('input').type('{downarrow}{enter}{esc}')
  })

/**
 * Clicks the checkbox option with the given value
 */
export const clickCheckboxGroupOption = ({ element, value }) => {
  cy.get(element).find(`input[value="${value}"]`).parent().click()
}

/**
 * Clicks the radiogroup option with the label
 */
export const clickRadioGroupOption = ({ element, label }) => {
  cy.get(element).contains('span', label).parent().click()
}

/**
 * Enter `input` into a typeahead `element` and select the first result
 */
export const selectFirstTypeaheadOption = ({ element, input }) => {
  cy.get(element).type(input)
  cy.get(element).find('[data-test="typeahead-menu-option"]').first().click()
  cy.get(element).find('input').blur()
}

/**
 * Removes a specific chip based on the data-value
 */
export const removeChip = (dataValue) => {
  cy.get('[data-test=filter-chips]').find(`[data-value="${dataValue}"]`).click()
}

/**
 * Adds a date to the any given date input field
 */
export const inputDateValue = ({ element, value }) => {
  cy.get(element).type(value)
}

/**
 * Adds a date object of {day, month, year} to the relevent input fields
 */
export const clearAndInputDateValueObject = ({ element, value }) => {
  cy.wrap(element).then(($el) => {
    cy.wrap($el).find('[data-test$="-day"]').clear().type(value.day.toString())
    cy.wrap($el)
      .find('[data-test$="-month"]')
      .clear()
      .type(value.month.toString())
    cy.wrap($el)
      .find('[data-test$="-year"]')
      .clear()
      .type(value.year.toString())
  })
}

/**
 * Clears and Types a value in an input field
 */
export const clearAndTypeInput = ({ element, value }) => {
  cy.wrap(element).then(($el) => {
    cy.wrap($el)
      .find('input')
      .clear()
      .type(value ?? '')
  })
}

/**
 * Clears and Types a value in an textarea field
 */
export const clearAndTypeTextArea = ({ element, value }) => {
  cy.wrap(element).then(($el) => {
    cy.wrap($el)
      .find('textarea')
      .clear()
      .type(value ?? '')
  })
}

/**
 * Remove the first item in a multi-select Typeahead
 */
export const removeFirstTypeaheadItem = () => {
  cy.get('[data-test="typeahead-chip"]').eq(0).click()
}

/**
 * Click on a button
 * @param {*} buttonText The text of the button you want to click
 */
export const clickButton = (buttonText) => {
  cy.contains('button', buttonText).click()
}

/**
 * Click on a Cancel anchor
 */
export const clickCancelLink = () => {
  cy.get('[data-test="cancel-button"]').click()
}

/**
 * Generic search request for a CollectionList
 * @param {*} endpoint The search endpoint
 * @param {*} fakeList The fake list of items to display
 * @param {*} link The page to render
 */
export const collectionListRequest = (endpoint, fakeList, link) => {
  const fullEndpoint = '/api-proxy/' + endpoint
  cy.intercept('POST', fullEndpoint, {
    body: {
      count: fakeList.length,
      results: fakeList,
    },
  }).as('apiRequest')
  cy.visit(link)
  cy.wait('@apiRequest')
}

export const omisCollectionListRequest = (
  endpoint,
  fakeList,
  link,
  subtotalCost = 23218.0
) => {
  const fullEndpoint = '/api-proxy/' + endpoint
  cy.intercept('POST', fullEndpoint, {
    body: {
      count: fakeList.length,
      results: fakeList,
      summary: {
        total_subtotal_cost: subtotalCost,
      },
    },
  }).as('apiRequest')
  cy.visit(link)
  cy.wait('@apiRequest')
}
