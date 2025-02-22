const qs = require('qs')

import { orderFaker } from '../../fakers/orders'
import { assertPayload } from '../../support/assertions'
import urls from '../../../../../src/lib/urls'
import {
  getCollectionList,
  assertCompanyCollectionBreadcrumbs,
  assertRemoveAllFiltersNotPresent,
  assertAddItemButton,
  assertAddItemButtonNotPresent,
  assertListLength,
  assertBadge,
  assertMetadataItem,
  assertMetadataItemNotPresent,
  assertItemLink,
  assertArchiveMessage,
  assertArchiveSummary,
  assertUnarchiveLink,
  assertUpdatedOn,
  assertOMISSumary,
} from '../../support/collection-list-assertions'

const fixtures = require('../../fixtures')

const { oneListCorp, archivedLtd } = fixtures.company

const buildQueryString = () =>
  qs.stringify({
    sortby: 'modified_on:desc',
  })

describe('Company Orders (OMIS) Collection Page', () => {
  const order1 = orderFaker({
    id: 111,
    reference: 'TMY947/21',
    company: {
      name: 'Williams-Rose',
    },
    contact: {
      name: 'Melissa Compton',
    },
    sector: {
      name: 'Advanced Engineering',
    },
    uk_region: {
      name: 'London',
    },
    created_on: '2020-11-30T01:28:26.124Z',
    modified_on: '2020-12-11T01:28:26.124Z',
    delivery_date: '2022-12-11T01:28:26.124Z',
    status: 'draft',
    primary_market: {
      name: 'The Bahamas',
    },
  })

  const order2 = orderFaker({
    delivery_date: null,
  })

  const ordersList = [order1, order2]

  before(() => {
    cy.intercept('POST', '/api-proxy/v3/search/order', {
      body: {
        count: ordersList.length,
        results: ordersList,
        summary: {
          total_subtotal_cost: 23218.0,
        },
      },
    }).as('apiRequest')
    cy.visit(urls.companies.orders(oneListCorp.id))
    cy.wait('@apiRequest')
  })

  beforeEach(() => {
    getCollectionList()
    cy.get('@collectionItems').eq(1).as('secondListItem')
  })

  assertCompanyCollectionBreadcrumbs(oneListCorp, 'Orders (OMIS)')

  it('should render a title', () => {
    cy.get('h1').should('have.text', 'One List Corp')
  })

  it('should render a meta title', () => {
    cy.title().should('eq', 'Orders - One List Corp - Companies - DIT Data Hub')
  })

  assertRemoveAllFiltersNotPresent()

  it('should render an "Add order" button', () => {
    assertAddItemButton(
      'Add order',
      `/omis/create?company=${oneListCorp.id}&skip-company=true`
    )
  })

  it('should render the sort options', () => {
    cy.get('[data-test="sortby"] option').then((options) => {
      const sortOptions = [...options].map((o) => ({
        value: o.value,
        label: o.label,
      }))
      expect(sortOptions).to.deep.eq([
        { value: 'created_on:desc', label: 'Recently created' },
        { value: 'created_on:asc', label: 'Oldest' },
        { value: 'modified_on:desc', label: 'Recently updated' },
        { value: 'modified_on:asc', label: 'Least recently updated' },
        { value: 'delivery_date:asc', label: 'Earliest delivery date' },
        { value: 'delivery_date:desc', label: 'Latest delivery date' },
      ])
    })
  })

  assertOMISSumary('Total value: £232.18')

  it('should display a list of orders', () => {
    assertListLength(ordersList)
  })

  context('API payload', () => {
    it('should have the correct payload', () => {
      const queryString = buildQueryString()
      cy.intercept('POST', '/api-proxy/v3/search/order', {
        body: {
          count: ordersList.length,
          results: ordersList,
        },
      }).as('apiRequest')
      cy.visit(`${urls.companies.orders(oneListCorp.id)}?${queryString}`)
      assertPayload('@apiRequest', {
        offset: 0,
        limit: 10,
        sortby: 'modified_on:desc',
        company: oneListCorp.id,
      })
    })
  })

  context('The first order', () => {
    it('should have a link with the reference', () => {
      assertItemLink(
        '@firstListItem',
        'TMY947/21 (Order reference)',
        '/omis/111/work-order'
      )
    })

    it('should contain "Draft" badge', () => {
      assertBadge('@firstListItem', 'Draft')
    })

    it('should contain "The Bahamas" badge', () => {
      assertBadge('@firstListItem', 'The Bahamas')
    })

    it('should render the updated date and time (modified_on)', () => {
      assertUpdatedOn('@firstListItem', 'Updated on 11 Dec 2020, 1:28am')
    })

    it('should render the company name', () => {
      assertMetadataItem('@firstListItem', 'Company Williams-Rose')
    })

    it('should render the created date (created_on)', () => {
      assertMetadataItem('@firstListItem', 'Created 30 Nov 2020, 1:28am')
    })

    it('should render the contact name', () => {
      assertMetadataItem('@firstListItem', 'Contact Melissa Compton')
    })

    it('should render the UK region', () => {
      assertMetadataItem('@firstListItem', 'UK region London')
    })

    it('should render the sector', () => {
      assertMetadataItem('@firstListItem', 'Sector Advanced Engineering')
    })

    it('should render the delivery date (delivery_date)', () => {
      assertMetadataItem('@firstListItem', 'Delivery date 11 Dec 2022')
    })
  })

  context('The second order', () => {
    it('should not render the delivery date (delivery_date)', () => {
      assertMetadataItemNotPresent('@secondListItem', 'Delivery date')
    })
  })

  context('when viewing orders for an archived company', () => {
    before(() => {
      cy.intercept('POST', '/api-proxy/v3/search/order', {
        body: {
          count: ordersList.length,
          results: ordersList,
          summary: {
            total_subtotal_cost: 23218.0,
          },
        },
      }).as('apiRequest')
      cy.visit(urls.companies.orders(archivedLtd.id))
      assertPayload('@apiRequest', {
        offset: 0,
        limit: 10,
        company: archivedLtd.id,
      })
    })

    assertArchiveSummary('order')
    assertArchiveMessage('Orders')
    assertUnarchiveLink(`/companies/${archivedLtd.id}/unarchive`)

    it('should not render an "Add order" button', () => {
      assertAddItemButtonNotPresent()
    })
  })
})
