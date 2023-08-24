import fixtures from '../../fixtures'
import urls from '../../../../../src/lib/urls'
import {
  interactionsListFaker,
  interactionFaker,
} from '../../fakers/interactions'
import { assertQueryParams } from '../../support/assertions'
import { format } from '../../../../../src/client/utils/date'

const interaction = interactionFaker()
const interactionsList = interactionsListFaker(10)

describe('Investment project interactions', () => {
  context('When the project has one interaction linked', () => {
    before(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?investment_project_id=${fixtures.investment.investmentWithDetails.id}&limit=10&offset=0`,
        {
          body: {
            count: 1,
            results: [interaction],
          },
        }
      ).as('apiRequest')
      cy.visit(
        urls.investments.projects.interactions.index(
          fixtures.investment.investmentWithDetails.id
        )
      )
    })

    it('should display the interactions list', () => {
      cy.wait('@apiRequest')
      cy.get('[data-test="collection-header').should('contain', '1 interaction')
    })

    it('should show the current and number of pages', () => {
      cy.contains('Page 1 of 1').should('be.visible')
    })

    it('should display the correct number of interactions', () => {
      cy.get('[data-test="collection-item"]').should('have.length', 1)
    })

    it('should show the interaction details in the collection list item', () => {
      cy.get('[data-test="collection-item"]')
        .find('a')
        .should('have.text', `${interaction.subject}`)
        .and('have.attr', 'href', urls.interactions.detail(interaction.id))

      cy.get('[data-test="collection-item"]')
        .find('[data-test="metadata"]')
        .should('contain', `Date ${format(interaction.date, 'dd MMMM yyyy')}`)
        .and('contain', `Contact(s) ${interaction.contacts[0].name}`)
        .and('contain', `Company ${interaction.companies[0].name}`)
        .and(
          'contain',
          `Adviser(s) ${interaction.dit_participants[0].adviser.name}, ${interaction.dit_participants[0].team.name}`
        )
        .and('contain', `Service ${interaction.service.name}`)
    })

    it('should not show pagination', () => {
      cy.get('[data-test=pagination]').should('not.exist')
    })
  })

  context('When the opportunity has more than 10 interactions linked', () => {
    beforeEach(() => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?investment_project_id=${fixtures.investment.investmentWithDetails.id}&limit=10&offset=0`,
        {
          body: {
            count: 11,
            results: interactionsList,
          },
        }
      ).as('apiRequest')
      cy.visit(
        urls.investments.projects.interactions.index(
          fixtures.investment.investmentWithDetails.id
        )
      )
      cy.wait('@apiRequest')
    })

    it('should show the number of interactions', () => {
      cy.get('[data-test="collection-header').should(
        'contain',
        '11 interactions'
      )
    })

    it('should show the current and number of pages', () => {
      cy.contains('Page 1 of 2').should('be.visible')
    })

    it('should allow sort by oldest interactions', () => {
      cy.get('[data-test="sortby"] select').select('date')
      assertQueryParams('sortby', 'date')
    })

    it('should allow sort by recently created interactions when changed back to default', () => {
      cy.get('[data-test="sortby"] select').select('date')
      cy.get('[data-test="sortby"] select').select('-date')
      assertQueryParams('sortby', '-date')
    })

    it('should display 10 interactions per page', () => {
      cy.get('[data-test="collection-item"]').should('have.length', 10)
    })

    it('should show the pagination', () => {
      cy.get('[data-test="pagination"]').should('be.visible')
      cy.get('[data-test="page-number-active"]').should('have.text', '1')
      cy.get('[data-test="page-number"]')
        .should('have.length', 1)
        .and('have.text', 2)
      cy.get('[data-test="next"]').should('be.visible')
    })

    it('should display 1 interaction on the second page', () => {
      cy.intercept(
        'GET',
        `/api-proxy/v4/interaction?investment_project_id=${fixtures.investment.investmentWithDetails.id}&limit=10&offset=10`,
        {
          body: {
            count: 11,
            results: [interaction],
          },
        }
      ).as('page2Request')
      cy.get('[data-test="page-number"]').contains('2').click()
      cy.wait('@page2Request')
      assertQueryParams('page', '2')
      cy.contains('Page 2 of 2').should('be.visible')
      cy.get('[data-test="page-number-active"]').should('have.text', '2')
      cy.get('[data-test="collection-item"]').should('have.length', 1)
    })
  })
})
