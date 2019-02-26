import selectors from '../../selectors'

let subject

describe('Add Interaction', () => {
  beforeEach(() => {
    subject = Math.random().toString(36).substring(7)
  })

  it('should add interaction by investment project', () => {
    cy.visit('/investment-projects/00086bb2-c5ee-4bfb-998f-0b417eafdd3e/interactions/create/interaction')

    cy.selectFirstOption(selectors.interactions.contact)
    cy.get(selectors.interactions.service).select('Account Management')
    cy.get(selectors.interactions.communicationChannel).select('Email/Website')
    cy.get(selectors.interactions.subject).type(subject)
    cy.get(selectors.interactions.notes).type('Conversation with potential client')
    cy.get(selectors.interactions.policyFeedbackNo).click()

    cy.get(selectors.interactions.addInteraction).click()

    cy.get('tr').eq(4).should('contain', subject)
  })

  it('should add service delivery interaction by company', () => {
    cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')

    cy.selectFirstOption(selectors.interactions.contact)
    cy.get(selectors.interactions.eventNo).click()
    cy.get(selectors.interactions.service).select('Bank Referral')
    cy.get(selectors.interactions.subject).type(subject)
    cy.get(selectors.interactions.notes).type('Conversation with potential client')
    cy.get(selectors.interactions.policyFeedbackNo).click()

    cy.get(selectors.interactions.addInteraction).click()

    cy.get('tr').eq(4).should('contain', subject)
  })

  it('should map values to the successfully created interaction form', () => {
    cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/interaction')
    cy.get(selectors.interactions.subject).type(subject)
    cy.get(selectors.interactions.addInteraction).click()

    cy.get('tr').eq(0).should('contain', 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978')
    cy.get('tr').eq(1).should('contain', 'Bob lawson')
    cy.get('tr').eq(2).should('contain', 'UKTI Team East Midlands - International Trade Team')
    cy.get('tr').eq(3).should('contain', 'Account Managment: Northern Powerhouse')
    cy.get('tr').eq(4).should('contain', subject)
    cy.get('tr').eq(5).should('contain', 'Sandbox')
    cy.get('tr').eq(6).should('contain', '7 February 2019')
    cy.get('tr').eq(7).should('contain', 'DIT Staff')
    cy.get('tr').eq(8).should('contain', 'Social Media')
    cy.get('tr').eq(9).should('contain', 'There are no files or documents')

    cy.get(selectors.details.successMsg).should('contain', 'Interaction created')
  })

  it('should map values to the successfully created service delivery form', () => {
    cy.visit('/companies/346f78a5-1d23-4213-b4c2-bf48246a13c3/interactions/create/service-delivery')
    cy.get(selectors.interactions.subject).type(subject)
    cy.get(selectors.interactions.addInteraction).click()

    cy.get('tr').eq(0).should('contain', 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978')
    cy.get('tr').eq(1).should('contain', 'Bob lawson')
    cy.get('tr').eq(2).should('contain', 'UKTI Team East Midlands - International Trade Team')
    cy.get('tr').eq(3).should('contain', 'Account Managment: Northern Powerhouse')
    cy.get('tr').eq(4).should('contain', subject)
    cy.get('tr').eq(5).should('contain', 'Sandbox')
    cy.get('tr').eq(6).should('contain', '7 February 2019')
    cy.get('tr').eq(7).should('contain', 'DIT Staff')
    cy.get('tr').eq(8).should('contain', 'Social Media')
    cy.get('tr').eq(9).should('contain', 'There are no files or documents')

    cy.get(selectors.details.successMsg).should('contain', 'Service delivery created')
  })
})
