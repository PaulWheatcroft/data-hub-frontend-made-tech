const fixtures = require('../../fixtures')
const selectors = require('../../selectors')
const { assertKeyValueTable, assertBreadcrumbs } = require('../../support/assertions')

describe('Interaction details', () => {
  context('Past draft interaction', () => {
    let params = {}

    before(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.draftPastMeeting.id

      cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        'Interaction': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', fixtures.interaction.draftPastMeeting.subject)
    })

    it('should render the details', () => {
      assertKeyValueTable('interactionDetails', {
        'Company': {
          href: `/companies/${fixtures.company.venusLtd.id}`,
          name: fixtures.company.venusLtd.name,
        },
        'Contact(s)': {
          href: '/contacts/71906039-858e-47ba-8016-f3c80da69ace',
          name: 'Theodore Schaden|6e4b048d-5bb5-4868-9455-aa712f4ceffd',
        },
        'Date of interaction': '20 May 2019',
        'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
      })
    })

    it('should render the "Complete interaction" button', () => {
      cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).should('be.visible')
      cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).should('have.text', 'Complete interaction ')
    })

    it('should not render the "Edit interaction" button', () => {
      cy.get(selectors.interaction.details.interaction.actions.editInteraction(params, 'other', 'service-delivery')).should('not.be.visible')
    })

    it('should render the "Back" link', () => {
      cy.get(selectors.interaction.details.interaction.actions.back(params)).should('be.visible')
      cy.get(selectors.interaction.details.interaction.actions.back(params)).should('have.text', 'Back')
    })

    it('should not render the "Why can I not complete this interaction?" details summary', () => {
      cy.get(selectors.interaction.details.interaction.whyCanINotComplete).should('not.be.visible')
    })
  })

  context('Future draft interaction', () => {
    let params = {}

    before(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.draftFutureMeeting.id

      cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        'Interaction': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', fixtures.interaction.draftFutureMeeting.subject)
    })

    it('should render the details', () => {
      assertKeyValueTable('interactionDetails', {
        'Company': {
          href: `/companies/${fixtures.company.venusLtd.id}`,
          name: fixtures.company.venusLtd.name,
        },
        'Contact(s)': {
          href: '/contacts/71906039-858e-47ba-8016-f3c80da69ace',
          name: 'Theodore Schaden|6e4b048d-5bb5-4868-9455-aa712f4ceffd',
        },
        'Date of interaction': '20 May 2030',
        'Adviser(s)': 'Brendan Smith, Aberdeen City Council',
      })
    })

    it('should not render the "Complete interaction" button', () => {
      cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).should('not.be.visible')
    })

    it('should not render the "Edit interaction" button', () => {
      cy.get(selectors.interaction.details.interaction.actions.editInteraction(params, 'other', 'service-delivery')).should('not.be.visible')
    })

    it('should render the "Back" link', () => {
      cy.get(selectors.interaction.details.interaction.actions.back(params)).should('be.visible')
      cy.get(selectors.interaction.details.interaction.actions.back(params)).should('have.text', 'Back')
    })

    it('should render the "Why can I not complete this interaction?" details summary', () => {
      cy.get(selectors.interaction.details.interaction.whyCanINotComplete).should('be.visible')
    })
  })

  context('Cancelled interaction', () => {
    let params = {}

    before(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.cancelledMeeting.id

      cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        'Interaction': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', fixtures.interaction.cancelledMeeting.subject)
    })

    it('should render the details', () => {
      assertKeyValueTable('interactionDetails', {
        'Company': {
          href: `/companies/${fixtures.company.venusLtd.id}`,
          name: fixtures.company.venusLtd.name,
        },
        'Contact(s)': {
          href: '/contacts/e2eee6cd-acf6-454a-a4a8-f6c8fa604fde',
          name: 'Tyson Morar',
        },
        'Date of interaction': '11 June 2019',
        'Adviser(s)': 'Brendan Smith, Digital Data Hub - Live Service',
      })
    })

    it('should not render the "Complete interaction" button', () => {
      cy.get(selectors.interaction.details.interaction.actions.completeInteraction(params)).should('not.be.visible')
    })

    it('should not render the "Edit interaction" button', () => {
      cy.get(selectors.interaction.details.interaction.actions.editInteraction(params, 'other', 'service-delivery')).should('not.be.visible')
    })

    it('should render the "Back" link', () => {
      cy.get(selectors.interaction.details.interaction.actions.back(params)).should('be.visible')
      cy.get(selectors.interaction.details.interaction.actions.back(params)).should('have.text', 'Back')
    })

    it('should not render the "Why can I not complete this interaction?" details summary', () => {
      cy.get(selectors.interaction.details.interaction.whyCanINotComplete).should('not.be.visible')
    })
  })

  context('Complete service delivery with documents', () => {
    let params = {}

    before(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.withLink.id

      cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        'Service delivery': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', fixtures.interaction.withLink.subject)
    })

    it('should render the details', () => {
      assertKeyValueTable('interactionDetails', {
        'Company': {
          href: `/companies/${fixtures.company.venusLtd.id}`,
          name: fixtures.company.venusLtd.name,
        },
        'Contact(s)': {
          href: '/contacts/9b1138ab-ec7b-497f-b8c3-27fed21694ef',
          name: 'Johnny Cakeman',
        },
        'Service': 'Events - UK Based',
        'Notes': 'This is a dummy service delivery for testing',
        'Date of service delivery': '5 September 2017',
        'Adviser(s)': '',
        'Event': {
          href: '/events/bda12a57-433c-4a0c-a7ce-5ebd080e09e8',
          name: 'Grand exhibition',
        },
        'Documents': 'View files and documents (will open another website)',
      })
    })

    it('should not render the "Complete interaction" button', () => {
      const completeInteraction = selectors.interaction.details.interaction.actions.completeInteraction(params)
      cy.get(completeInteraction).should('not.be.visible')
    })

    it('should render the "Edit interaction" button', () => {
      const editInteraction = selectors.interaction.details.interaction.actions.editInteraction(params, 'other', 'service-delivery')
      cy.get(editInteraction).should('be.visible')
      cy.get(editInteraction).should('have.text', 'Edit service delivery ')
    })

    it('should render the "Back" link', () => {
      const back = selectors.interaction.details.interaction.actions.back(params)
      cy.get(back).should('be.visible')
      cy.get(back).should('have.text', 'Back')
    })

    it('should not render the "Why can I not complete this interaction?" details summary', () => {
      cy.get(selectors.interaction.details.interaction.whyCanINotComplete).should('not.be.visible')
    })
  })

  context('Complete investment project interaction without documents', () => {
    let params = {}

    before(() => {
      params.companyId = fixtures.company.venusLtd.id
      params.interactionId = fixtures.interaction.withNoLink.id

      cy.visit(`/companies/${params.companyId}/interactions/${params.interactionId}`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        'Home': '/',
        'Companies': '/companies',
        'Interaction': null,
      })
    })

    it('should render the heading', () => {
      cy.get(selectors.localHeader().heading).should('have.text', fixtures.interaction.withNoLink.subject)
    })

    it('should render the details', () => {
      assertKeyValueTable('interactionDetails', {
        'Company': {
          href: `/companies/${fixtures.company.venusLtd.id}`,
          name: fixtures.company.venusLtd.name,
        },
        'Contact(s)': {
          href: `/contacts/${fixtures.contact.deanCox.id}`,
          name: fixtures.contact.deanCox.name,
        },
        'Service': 'UKEF - EFA Advice',
        'Notes': 'This is a dummy interaction for testing',
        'Date of interaction': '5 June 2017',
        'Adviser(s)': '',
        'Investment project': {
          href: `/investments/projects/${fixtures.investment.newHotelFdi.id}`,
          name: fixtures.investment.newHotelFdi.name,
        },
        'Communication channel': 'Email/Website',
        'Documents': 'There are no files or documents',
      })
    })

    it('should not render the "Complete interaction" button', () => {
      const completeInteraction = selectors.interaction.details.interaction.actions.completeInteraction(params)
      cy.get(completeInteraction).should('not.be.visible')
    })

    it('should render the "Edit interaction" button', () => {
      const editInteraction = selectors.interaction.details.interaction.actions.editInteraction(params, 'other', 'interaction')
      cy.get(editInteraction).should('be.visible')
      cy.get(editInteraction).should('have.text', 'Edit interaction ')
    })

    it('should render the "Back" link', () => {
      const back = selectors.interaction.details.interaction.actions.back(params)
      cy.get(back).should('be.visible')
      cy.get(back).should('have.text', 'Back')
    })

    it('should not render the "Why can I not complete this interaction?" details summary', () => {
      cy.get(selectors.interaction.details.interaction.whyCanINotComplete).should('not.be.visible')
    })
  })
})
