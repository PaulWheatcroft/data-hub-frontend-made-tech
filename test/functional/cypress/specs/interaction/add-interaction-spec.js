const fixtures = require('../../fixtures/index.js')
const selectors = require('../../selectors')
const utils = require('../../support/utils')

const serviceDeliveryDetails = selectors.interactionDetails.serviceDelivery

describe('Add Interaction', () => {
  context('when adding an interaction', () => {
    context('when in the context of a company', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/interaction`)
      })

      it('should add the interaction', () => {
        const subject = utils.randomString()

        populateInteractionForm(subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Interaction created' })
      })
    })

    context('when in the context of a contact', () => {
      beforeEach(() => {
        cy.visit(`/contacts/${fixtures.default.id}/interactions/create/interaction`)
      })

      it('should add the interaction', () => {
        const subject = utils.randomString()

        populateInteractionForm(subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Interaction created' })
      })
    })

    context('when in the context of an investment project', () => {
      beforeEach(() => {
        cy.visit(`/investments/projects/${fixtures.default.id}/interactions/create/interaction`)
      })

      it('should add the interaction', () => {
        const subject = utils.randomString()

        populateInteractionForm(subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Interaction created' })
      })
    })
  })

  context('when adding a service delivery', () => {
    context('when in the context of a company', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        populateServiceDeliveryForm('Bank Referral', subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Service delivery created' })
      })
    })

    context('when in the context of a contact', () => {
      beforeEach(() => {
        cy.visit(`/contacts/${fixtures.default.id}/interactions/create/service-delivery`)
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        populateServiceDeliveryForm('Bank Referral', subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Service delivery created' })
      })
    })

    context('when in the context of an investment project', () => {
      beforeEach(() => {
        cy.visit(`/investments/projects/${fixtures.default.id}/interactions/create/service-delivery`)
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        populateServiceDeliveryForm('Account Management', subject)

        cy.get(selectors.interactionForm.add).click()

        assertDetails({ subject, flashMessage: 'Service delivery created' })
      })
    })

    context('when TAP service fields are empty', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
        cy.get(selectors.interactionForm.eventNo).click()
        cy.get(selectors.interactionForm.service).select('Tradeshow Access Programme (TAP)')
        cy.get(selectors.interactionForm.subject).type(subject)
        cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
        cy.get(selectors.interactionForm.policyFeedbackNo).click()

        cy.get(selectors.interactionForm.add).click()

        cy.get(serviceDeliveryDetails.subject).should('contain', subject)
      })
    })

    context('when TAP service fields are populated', () => {
      beforeEach(() => {
        cy.visit(`/companies/${fixtures.default.id}/interactions/create/service-delivery`)
      })

      it('should add the service delivery', () => {
        const subject = utils.randomString()

        cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
        cy.get(selectors.interactionForm.eventNo).click()
        cy.get(selectors.interactionForm.service).select('Tradeshow Access Programme (TAP)')
        cy.get(selectors.interactionForm.serviceStatus).select('Current')
        cy.get(selectors.interactionForm.grantOffered).type('Approved')
        cy.get(selectors.interactionForm.subject).type(subject)
        cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
        cy.get(selectors.interactionForm.policyFeedbackNo).click()

        cy.get(selectors.interactionForm.add).click()

        cy.get(serviceDeliveryDetails.subject).should('contain', subject)
        // TODO assert TAP status fields are set in details
      })
    })

    // TODO test policy feedback fields
  })
})

const populateInteractionForm = (subject) => {
  cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.interactionForm.service).select('Account Management')
  cy.get(selectors.interactionForm.communicationChannel).select('Email/Website')
  cy.get(selectors.interactionForm.subject).type(subject)
  cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
  cy.get(selectors.interactionForm.policyFeedbackNo).click()
}

const populateServiceDeliveryForm = (service, subject) => {
  cy.get(selectors.interactionForm.contact).select('Joseph Woof, Dog master')
  cy.get(selectors.interactionForm.eventNo).click()
  cy.get(selectors.interactionForm.service).select(service)
  cy.get(selectors.interactionForm.subject).type(subject)
  cy.get(selectors.interactionForm.notes).type('Conversation with potential client')
  cy.get(selectors.interactionForm.policyFeedbackNo).click()
}

const assertDetails = ({
  flashMessage,
  company = 'Zboncak Group|271eb29e-425b-4cd8-b386-3208c3a5f978',
  contact = 'Bob lawson',
  service = 'Account Managment: Northern Powerhouse',
  subject,
  notes = 'Sandbox',
  dateOfInteraction = '7 February 2019',
  ditAdviser = 'DIT Staff',
  communicationChannel = 'Social Media',
  documents = 'There are no files or documents',
}) => {
  cy.get(serviceDeliveryDetails.successMsg).should('contain', flashMessage)
  cy.get(serviceDeliveryDetails.company).should('contain', company)
  cy.get(serviceDeliveryDetails.contacts).should('contain', contact)
  cy.get(serviceDeliveryDetails.service).should('contain', service)
  cy.get(serviceDeliveryDetails.subject).should('contain', subject)
  cy.get(serviceDeliveryDetails.notes).should('contain', notes)
  cy.get(serviceDeliveryDetails.dateOfInteraction).should('contain', dateOfInteraction)
  cy.get(serviceDeliveryDetails.ditAdviser).should('contain', ditAdviser)
  cy.get(serviceDeliveryDetails.communicationChannel).should('contain', communicationChannel)
  cy.get(serviceDeliveryDetails.documents).should('contain', documents)
}
