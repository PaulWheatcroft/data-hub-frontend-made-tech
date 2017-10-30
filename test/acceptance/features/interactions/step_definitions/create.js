const { client } = require('nightwatch-cucumber')
const { defineSupportCode } = require('cucumber')
const faker = require('faker')
const { set } = require('lodash')

const { getUid, appendUid } = require('../../../helpers/uuid')

const companySearchPage = `${process.env.QA_HOST}/search/companies` // TODO move these urls out into a url world object
const dashboardPage = `${process.env.QA_HOST}/`

defineSupportCode(({ Given, When, Then }) => {
  const Company = client.page.Company()
  const Interaction = client.page.Interaction()
  const Contact = client.page.Contact()
  const Search = client.page.Search()

  Given(/^a company is created for interactions$/, async function () {
    const companyName = appendUid(faker.company.companyName())

    await client
      .url(companySearchPage)

    await Company
      .createUkNonPrivateOrNonPublicLimitedCompany(
        { name: companyName },
        (company) => set(this.state, 'company', company),
      )
      .wait() // wait for backend to sync
  })

  Given(/^a company contact is created for interactions$/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.company.name))

    await Company
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .waitForElementVisible('@contacts')
      .click('@contacts')

    await Contact
      .createNewPrimaryContact({}, (contact) => set(this.state, 'contact', contact))
      .wait() // wait for backend to sync
  })

  Given(/^a company investment project is created for interactions$/, async function () {
  })

  When(/^adding an interaction/, async function () {
    await Interaction
      .createInteraction({}, (interaction) => set(this.state, 'interaction', interaction))
      .wait()
  })

  When(/^navigating to the create company interactions and services step 1 page/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.company.name))

    await Company
      .section.firstCompanySearchResult
      .click('@header')

    await Company.section.detailsTabs
      .waitForElementVisible('@interactions')
      .click('@interactions')

    await Company
      .waitForElementVisible('@addInteractionButton')
      .click('@addInteractionButton')
  })

  When(/^navigating to the create contact interactions and services step 1 page/, async function () {
    await client
      .url(dashboardPage)

    await Search
      .search(getUid(this.state.contact.lastName))
      .section.tabs.click('@contacts')

    await Contact
      .section.firstContactSearchResult
      .click('@header')

    await Contact.section.detailsTabs
      .waitForElementVisible('@interactions')
      .click('@interactions')

    await Contact
      .waitForElementVisible('@addInteractionButton')
      .click('@addInteractionButton')
  })

  When(/^navigating to the create investment project interaction page/, async function () {
  })

  When(/^selecting interaction/, async function () {
    await Interaction
      .waitForElementVisible('@continueButton')
      .click('@aStandardInteraction')
      .click('@continueButton')
  })

  When(/^selecting service delivery/, async function () {
    await Interaction
      .waitForElementVisible('@continueButton')
      .click('@aServiceThatYouHaveProvided')
      .click('@continueButton')
  })

  When(/^the interaction events Yes option is chosen/, async function () {
    await Interaction
      .setValue('@eventYes', '')
      .click('@eventYes')
  })

  When(/^the interaction events No option is chosen/, async function () {
    await Interaction
      .setValue('@eventNo', '')
      .click('@eventNo')
  })

  Then(/^there are interaction fields$/, async function () {
    await Interaction
      .waitForElementVisible('@contact')
      .assert.visible('@contact')
      .assert.visible('@serviceProvider')
      .assert.visible('@service')
      .assert.visible('@subject')
      .assert.visible('@notes')
      .assert.visible('@dateOfInteractionYear')
      .assert.visible('@dateOfInteractionMonth')
      .assert.visible('@dateOfInteractionDay')
      .assert.visible('@ditAdviser')
      .assert.visible('@communicationChannel')
      .assert.elementNotPresent('@eventYes')
      .assert.elementNotPresent('@eventNo')
      .assert.elementNotPresent('@event')
  })

  Then(/^there are service delivery fields$/, async function () {
    await Interaction
      .waitForElementVisible('@contact')
      .assert.visible('@contact')
      .assert.visible('@serviceProvider')
      .assert.visible('@service')
      .assert.visible('@subject')
      .assert.visible('@notes')
      .assert.visible('@dateOfInteractionYear')
      .assert.visible('@dateOfInteractionMonth')
      .assert.visible('@dateOfInteractionDay')
      .assert.visible('@ditAdviser')
      .assert.elementNotPresent('@communicationChannel')
      .assert.visible('@eventYes')
      .assert.visible('@eventNo')
      .assert.elementPresent('@event')
  })

  Then(/^interaction fields are pre-populated$/, async function () {
    const assertIsSet = (result) => client.expect(result.value.length).to.be.greaterThan(0)
    // TODO test user does not have a DIT team
    // await Interaction.getValue('@serviceProvider', assertIsSet)
    await Interaction.getValue('@dateOfInteractionYear', assertIsSet)
    await Interaction.getValue('@dateOfInteractionMonth', assertIsSet)
    await Interaction.getValue('@dateOfInteractionDay', assertIsSet)
    await Interaction.getValue('@ditAdviser', assertIsSet)
  })

  Then(/^the interaction events is displayed$/, async function () {
    await Interaction
      .assert.visible('@event')
  })

  Then(/^the interaction events is not displayed$/, async function () {
    await Interaction
      .assert.hidden('@event')
  })
})
