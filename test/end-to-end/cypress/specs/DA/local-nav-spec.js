const fixtures = require('../../fixtures')
const selectors = require('../../../../selectors')

const {
  companies,
  contacts,
  dashboard,
  investments,
} = require('../../../../../src/lib/urls')

const {
  assertLocalNav,
  assertLocalReactNav,
} = require('../../support/assertions')

describe('DA Permission', () => {
  describe('activity', () => {
    const company = fixtures.company.create.corp()

    before(() => {
      cy.loadFixture([company])
      cy.visit(companies.detail(company.pk))
    })

    it('should display DA only tabs', () => {
      assertLocalReactNav('[data-test="tabbedLocalNavList"]', [
        'Company contacts',
        'Business details',
        'Core team',
        'Investment',
        'Orders',
      ])
    })
  })

  describe('dashboard', () => {
    before(() => {
      cy.visit(dashboard())
    })

    it('should display DA only tabs', () => {
      assertLocalNav(selectors.nav.headerNav, [
        'Companies',
        'Contacts',
        'Investments',
        'Orders',
        'Market access',
        'Support',
      ])
    })
  })

  describe('contact details', () => {
    const company = fixtures.company.create.defaultCompany('local nav da')
    const contact = fixtures.contact.create(company.pk)

    before(() => {
      cy.loadFixture([company])
      cy.loadFixture([contact])
      cy.visit(contacts.details(contact.pk))
    })

    it('should display DA only tabs', () => {
      assertLocalReactNav('[data-test=local-nav] > ul', [
        'Details',
        'Audit history',
      ])
    })
  })

  describe('investment projects', () => {
    before(() => {
      cy.visit(
        investments.projects.details(
          fixtures.investmentProject.newGolfCourse.id
        )
      )
    })

    it('should display DA only tabs', () => {
      assertLocalNav(selectors.nav.sideNav, [
        'Project details',
        'Project team',
        'Interactions',
        'Evaluations',
        'Propositions',
        'Edit history',
        'Evidence',
      ])
    })
  })
})
