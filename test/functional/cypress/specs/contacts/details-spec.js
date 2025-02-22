import { contacts } from '../../../../../src/lib/urls'
import {
  EMAIL_CONSENT_NO,
  EMAIL_CONSENT_YES,
} from '../../../../../src/apps/contacts/constants'

const completeUKContact = require('../../../../sandbox/fixtures/v3/contact/contact-complete-details-uk.json')
const incompleteUKContact = require('../../../../sandbox/fixtures/v3/contact/contact-incomplete-details-uk.json')
const companyAddresscontact = require('../../../../sandbox/fixtures/v3/contact/contact-with-company-address.json')
const usContact = require('../../../../sandbox/fixtures/v3/contact/contact-with-us-address.json')
const archiveContact = require('../../../../sandbox/fixtures/v3/contact/contact-archived.json')

const ARCHIVE_INTERCEPT = 'archiveHttpRequest'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
  assertFieldRadios,
  assertErrorSummary,
  assertAPIRequest,
  assertRequestBody,
  assertFlashMessage,
} = require('../../support/assertions')

describe('View contact details', () => {
  context('when viewing a contact', () => {
    before(() => {
      cy.visit('/contacts/2676ea91-9dd7-4cf3-a4a3-67b06f841b54')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Contacts: contacts.index(),
        'Joseph Woof': null,
      })
    })

    it('should render the subheading', () => {
      cy.contains('Contact details').should('exist')
    })

    it('should render the details table', () => {
      assertKeyValueTable('contact-details-table', {
        'Job title': completeUKContact.job_title,
        'Phone number': completeUKContact.full_telephone_number,
        Address:
          '123 Test Street, Address Line 2, Sandbox Town, Test County, AB1 2CD, United Kingdom',
        Email: completeUKContact.email,
        'More details': completeUKContact.notes,
        'Email marketing': EMAIL_CONSENT_YES,
      })
    })

    it('should render the Edit Contact button', () => {
      cy.get('[data-test=edit-contact-button]')
        .should('exist')
        .should('have.text', 'Edit Contact')
        .should('have.attr', 'href', contacts.edit(completeUKContact.id))
    })

    it('should render the archive container', () => {
      cy.get('[data-test=archive-contact-container]').should('exist')
      cy.get('[data-test=archive-header]')
        .should('exist')
        .should('have.text', 'Archive contact')
      cy.get('[data-test=archive-hint]')
        .should('exist')
        .should(
          'have.text',
          'Archive this contact if it is no longer required or active.'
        )
      cy.get('[data-test=archive-button]')
        .should('exist')
        .should('have.text', 'Archive')

      cy.get('[data-test=archive-button]').click()

      cy.get('[data-test=field-archived_reason]').then((element) => {
        assertFieldRadios({
          element,
          label: 'Archive reason',
          hint: 'This contact has:',
          optionsCount: 4,
        })
      })

      cy.get('[data-test=archived-reason-left-the-company]')
        .should('exist')
        .should('have.value', 'Left the company')

      cy.get('[data-test=archived-reason-does-not-want-to-be-contacted]')
        .should('exist')
        .should('have.value', 'Does not want to be contacted')

      cy.get('[data-test=archived-reason-changed-role-responsibility]')
        .should('exist')
        .should('have.value', 'Changed role/responsibility')

      cy.get('[data-test=archived-reason-other]')
        .should('exist')
        .should('have.value', 'Other')

      cy.get('[data-test=submit-button]')
        .should('exist')
        .should('have.text', 'Archive')

      cy.get('[data-test=cancel-button]')
        .should('exist')
        .should('have.text', 'Cancel')
        .should('have.attr', 'href', contacts.details(completeUKContact.id))
    })

    context('with partial details', () => {
      before(() => {
        cy.visit('/contacts/bc05d7fc-ce71-448a-a60d-8a67fb5bfe06')
      })

      it('should only render the existing details', () => {
        assertKeyValueTable('contact-details-table', {
          'Job title': incompleteUKContact.job_title,
          Address: '123 Test Street, Sandbox Town, AB1 2CD, United Kingdom',
          Email: incompleteUKContact.email,
          'Email marketing': EMAIL_CONSENT_YES,
        })
      })
    })
    context('with the company address', () => {
      before(() => {
        cy.visit('/contacts/a55af9e5-c53c-4696-9647-065b28ea02de')
      })

      it('should render the details table with the company address', () => {
        assertKeyValueTable('contact-details-table', {
          'Job title': companyAddresscontact.job_title,
          'Phone number': companyAddresscontact.full_telephone_number,
          Address:
            '3 Priory Court, Kingshill Road, Dursley, Gloucestershire, GL11 4DH, United Kingdom',
          Email: companyAddresscontact.email,
          'Email marketing': EMAIL_CONSENT_NO,
        })
      })
    })
    context('based in the US', () => {
      before(() => {
        cy.visit('/contacts/b0cb178b-49d3-467a-9cd7-90cb0fe0f30a')
      })

      it('should render details table with the state visible', () => {
        assertKeyValueTable('contact-details-table', {
          'Job title': usContact.job_title,
          'Phone number': usContact.full_telephone_number,
          Address:
            '123 Test Boulevard, Basney, US State, 9416875, United States',
          Email: usContact.email,
          'More details': usContact.notes,
          'Email marketing': EMAIL_CONSENT_NO,
        })
      })
    })
  })

  context('when viewing an archived contact', () => {
    before(() => {
      cy.visit('/contacts/1ba51fde-88be-43b3-8701-5c9adcc5cbfb')
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: '/',
        Contacts: contacts.index(),
        'Joseph Woof': null,
      })
    })

    it('should render the archived contact message', () => {
      cy.get('[data-test=archive-message]')
        .should('exist')
        .contains(
          'This contact was archived on 04 Jul 2019 by Bernard Harris-Patel.'
        )
      cy.get('[data-test=archive-reason]').contains('Reason: Left the company')

      cy.get('[data-test=unarchive-link]')
        .should('exist')
        .should('have.text', 'Unarchive')
        .should('have.attr', 'href', contacts.unarchive(archiveContact.id))
    })

    it('should render the subheading', () => {
      cy.contains('Contact details').should('exist')
    })

    it('should render the details table', () => {
      assertKeyValueTable('contact-details-table', {
        'Job title': archiveContact.job_title,
        'Phone number': archiveContact.full_telephone_number,
        Address:
          '123 Test Street, Address Line 2, Sandbox Town, Test County, AB1 2CD, United Kingdom',
        Email: archiveContact.email,
        'More details': archiveContact.notes,
        'Email marketing': EMAIL_CONSENT_YES,
      })
    })

    it('should not render the Edit Contact button', () => {
      cy.get('[data-test=edit-contact-button]').should('not.exist')
    })

    it('should not render the archive container', () => {
      cy.get('[data-test=archive-contact-container]').should('not.exist')
    })
  })

  context('when archiving a contact', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api-proxy/v3/contact/*/archive').as(
        ARCHIVE_INTERCEPT
      )
      cy.visit('/contacts/2676ea91-9dd7-4cf3-a4a3-67b06f841b54')
    })

    it('should not submit the form if no reason is given', () => {
      cy.get('[data-test=archive-button]').click()
      cy.get('[data-test=submit-button]').click()
      assertErrorSummary(['You must select a reason'])

      cy.get('[data-test=archived-reason-other]').click()
      cy.get('[data-test=submit-button]').click()
      assertErrorSummary(['You must enter a reason'])
    })

    it('should submit the archive form', () => {
      const expectedBody = {
        reason: 'Left the company',
      }
      cy.get('[data-test=archive-button]').click()
      cy.get('[data-test=archived-reason-left-the-company]').click()
      cy.get('[data-test=submit-button]').click()

      assertAPIRequest(ARCHIVE_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertFlashMessage('Contact record updated')
      })
    })

    it('should submit the archive form with a custom archival reason', () => {
      const expectedBody = {
        reason: 'Test that the other functionality works',
      }
      cy.get('[data-test=archive-button]').click()
      cy.get('[data-test=archived-reason-other]').click()
      cy.get('[data-test=archived-reason-other-input]').type(
        'Test that the other functionality works'
      )
      cy.get('[data-test=submit-button]').click()

      assertAPIRequest(ARCHIVE_INTERCEPT, (xhr) => {
        assertRequestBody(xhr, expectedBody)
        assertFlashMessage('Contact record updated')
      })
    })
  })
})
