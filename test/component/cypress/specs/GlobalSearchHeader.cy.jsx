import React from 'react'
import GlobalSearchHeader from '../../../../src/client/components/GlobalSearchHeader'

describe('Global Search Header', () => {
  const Component = (props) => (
    <GlobalSearchHeader data-test="global-search-header" {...props} />
  )

  context('should mount when mars is the search term', () => {
    const highlightTerm = 'mars'
    const actionButton = [
      {
        label: 'Add company',
        url: '/companies/create',
      },
    ]
    const actionLink = [
      {
        label: 'Filter companies',
        url: `/companies?name=${highlightTerm}&archived=false`,
      },
    ]

    const resultText = '2 results matching mars'
    beforeEach(() => {
      cy.mount(
        <div>
          <Component
            count={2}
            countLabel="result"
            highlightTerm={highlightTerm}
            actionButtons={actionButton}
            actionLinks={actionLink}
          />
        </div>
      )
    })

    it('should render the number of results using the search term', () => {
      cy.get('[data-test="global-search-header"]')
        .should('exist')
        .should('contain', resultText)
    })
    it('should render the action button', () => {
      cy.get('[data-test="add-collection-item-button"]')
        .should('exist')
        .should('have.attr', 'href')
    })
    it('should render the filter results link', () => {
      cy.get('[data-test="link-to-collection-list"]')
        .should('exist')
        .should('have.attr', 'href')
        .and('include', '/companies?name=mars&archived=false')
    })
  })
  context('should mount when there are no search terms', () => {
    const highlightTerm = ''
    const actionButton = [
      {
        label: 'Add company',
        url: '/companies/create',
      },
    ]
    const actionLink = [
      {
        label: 'Filter companies',
        url: `/companies?name=${highlightTerm}&archived=false`,
      },
    ]

    const resultText = '2 results'
    beforeEach(() => {
      cy.mount(
        <div>
          <Component
            count={2}
            countLabel="result"
            highlightTerm={highlightTerm}
            actionButtons={actionButton}
            actionLinks={actionLink}
          />
        </div>
      )
    })

    it('should render the number of results using the search term', () => {
      cy.get('[data-test="global-search-header"]')
        .should('exist')
        .should('contain', resultText)
    })
    it('should render the action button', () => {
      cy.get('[data-test="add-collection-item-button"]')
        .should('exist')
        .should('have.attr', 'href')
    })
    it('should render the filter results link', () => {
      cy.get('[data-test="link-to-collection-list"]')
        .should('exist')
        .should('have.attr', 'href')
        .and('include', '/companies?name=&archived=false')
    })
  })
})
