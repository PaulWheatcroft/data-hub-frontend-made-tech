import { company } from '../../fixtures'
import { exportFaker } from '../../fakers/export'
import {
  companyGlobalUltimateAllDetails,
  companyNoDetails,
} from '../../fakers/companies'

const {} = require('../../support/assertions')
const fixtures = require('../../fixtures')
const urls = require('../../../../../src/lib/urls')

const { usCompany } = company

describe('Company overview page', () => {
  const interactionUrlAllOverview = urls.companies.interactions.index(
    fixtures.company.allOverviewDetails.id
  )
  const addInteractionUrlAllOverview = urls.companies.interactions.create(
    fixtures.company.allOverviewDetails.id
  )
  const addInteractionUrlNoOverview = urls.companies.interactions.create(
    fixtures.company.noOverviewDetails.id
  )
  const allActivityUrlAllOverview = urls.companies.activity.index(
    fixtures.company.allOverviewDetails.id
  )
  const noActiveInvestments = exportFaker({
    count: 10,
    results: [],
  })

  context(
    'when viewing company overview the tab should display Overview',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('tab should contain the text Overview', () => {
        cy.get('[data-test="tabbedLocalNavList"]')
          .children()
          .children()
          .should('contain.text', 'Overview')
      })
    }
  )
  context(
    'when viewing the Overview page a Business details card should be displayed',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('the card should contain the Business details table', () => {
        cy.get('[data-test="business-details-container"]')
          .as('bd-table')
          .first()
          .contains('Business details')
        cy.get('@bd-table').find('tbody').should('exist')
      })
    }
  )

  context(
    'when viewing the Overview page an Account Management card should be displayed',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('the card should contain the Account management table', () => {
        cy.get('[data-test="account-management-container"]')
          .as('am-table')
          .first()
          .contains('Account management')
        cy.get('@am-table').find('tbody').should('exist')
      })
    }
  )

  context(
    'when viewing the export status card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(companyGlobalUltimateAllDetails.id)
        )
      })

      it('the card should contain the Export status table', () => {
        cy.get('[data-test="export-status-container"]')
          .as('es-table')
          .first()
          .contains('Export status')
        cy.get('@es-table').find('tbody').should('exist')
      })

      it('the card should contain the export status table including the last export win and total exports won', () => {
        cy.get('[data-test="export-status-container"]').children()
        cy.get('th')
          .contains('Last export win')
          .siblings()
          .contains('td', '04 Dec 2019, Burkina Faso')
        cy.get('th')
          .contains('Total exports won')
          .siblings()
          .contains('td', '8')
      })
    }
  )
  context(
    'when viewing the Export Status Card and an error occurs during the Export Wins lookup',
    () => {
      before(() => {
        cy.intercept('GET', urls.company.exportWin(companyNoDetails.id), {
          statusCode: 500,
          body: {
            detail:
              "('The Company matching service returned an error status: 401',)",
          },
        })
        cy.visit(urls.companies.overview.index(companyNoDetails.id))
      })

      it('the card should contain the Export Status table', () => {
        cy.get('[data-test="export-status-container"]')
        cy.get('th')
          .contains('Total exports won')
          .siblings()
          .contains('td', 'Unable to load export wins')
      })
    }
  )

  context(
    'when viewing the investment status card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain the investment status table including all keys and accurate totals', () => {
        cy.get('[data-test="investmentsStatusContainer"]')
          .children()
          .first()
          .contains('Investment status')
          .next()
          .children()
        cy.get('th')
          .contains('Last Project won')
          .siblings()
          .contains('td', '07 Jun 2022')
        cy.get('[data-test="latest-won-project-link"]').click()
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.details(
            '945ea6d1-eee3-4f5b-9144-84a75b71b8e6'
          )
        )
        cy.go('back')
        cy.get('[data-test="investmentsStatusContainer"]')
        cy.get('th')
          .contains('Total projects won')
          .siblings()
          .contains('td', '0')
        cy.get('th').contains('Active projects').siblings().contains('td', '4')
        cy.get('th')
          .contains('Prospect projects')
          .siblings()
          .contains('td', '3')
        cy.get('th')
          .contains('Verify win projects')
          .siblings()
          .contains('td', '1')
        cy.get('th')
          .contains('Abandoned projects')
          .siblings()
          .contains('td', '1')
      })
      it('the card should link to the investment page', () => {
        cy.get('[data-test="investment-page-link"]')
          .contains('View all investments')
          .click()
        cy.location('pathname').should(
          'eq',
          urls.companies.investments.companyInvestmentProjects(
            'ba8fae21-2895-47cf-90ba-9273c94dab88'
          )
        )
        cy.go('back')
      })
    }
  )

  context(
    'when viewing the investment status card with different stages and statuses of investment projects',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should link to the latest won project', () => {
        cy.get('[data-test="latest-won-project-link"]')
          .contains('07 Jun 2022')
          .click()
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.details(
            '945ea6d1-eee3-4f5b-9144-84a75b71b8e6'
          )
        )
        cy.go('back')
      })
      it('the card should link to the active projects', () => {
        cy.get('[data-test="total-active-projects"]').contains('4').click()
        cy.go('back')
      })
      it('the card should link to the prospect projects', () => {
        cy.get('[data-test="total-prospect-projects"]').contains('3').click()
        cy.go('back')
      })
      it('the card should link to the verify win projects', () => {
        cy.get('[data-test="total-verify-win-projects"]').contains('1').click()
        cy.go('back')
      })
      it('the card should link to the abandoned projects', () => {
        cy.get('[data-test="total-abandoned-projects"]').contains('1').click()
        cy.go('back')
      })
      it('Inactive projects should not include an "Add investment project" button', () => {
        cy.get('[data-test="tabbedLocalNav"]').contains('Investment').click()
        cy.get('add-collection-item-button').should('not.exist')
        cy.go('back')
      })
      it('UK based Active projects should not have an "Add investment project" button', () => {
        cy.get('[data-test="tabbedLocalNav"]').contains('Investment').click()
        cy.get('add-collection-item-button').should('not.exist')
        cy.go('back')
      })
    }
  )

  context(
    'Active projects should include an Add investment project button with the current company pre selected',
    () => {
      before(() => {
        cy.visit(
          urls.companies.investments.companyInvestmentProjects(usCompany.id)
        )
        cy.get('[data-test=add-collection-item-button]').click()
      })
      it('should take us to create investment page', () => {
        cy.location('pathname').should(
          'eq',
          urls.investments.projects.create(
            'b2c34b41-1d5a-4b4b-9249-7c53ff2868ab'
          )
        )
      })
    }
  )

  context('when viewing the Recent Activities Card for a business', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('the card should contain the Recent activity heading and add interaction link', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .children()
        .first()
        .contains('Recent activity')
        .children()
        .contains('Add interaction')
        .click()
      cy.location('pathname').should('eq', addInteractionUrlAllOverview)
      cy.go('back')
    })
    it('the card should contain three activities', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .find('ol')
        .children()
        .should('have.length', 3)
    })
    it('the card should link to the activity overview page', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .contains('View all activities')
        .click()
      cy.location('pathname').should('eq', allActivityUrlAllOverview)
      cy.go('back')
    })
  })

  context(
    'when viewing the Recent Activities Card for a business with no activities',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the Recent activity heading and add interaction link', () => {
        cy.get('[data-test="Recent activityCardContainer"]')
          .children()
          .first()
          .contains('Recent activity')
          .children()
          .contains('Add interaction')
          .click()
        cy.location('pathname').should('eq', addInteractionUrlNoOverview)
        cy.go('back')
        cy.get('[data-test="noActivities"]').contains(
          'There are no activities to show.'
        )
      })
    }
  )

  context('when viewing the Upcoming Activities Card for a business', () => {
    before(() => {
      cy.visit(
        urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
      )
    })

    it('the card should contain the Upcoming activity heading and add interaction link', () => {
      cy.get('[data-test="Upcoming activityCardContainer"]')
        .children()
        .first()
        .contains('Upcoming activity')
        .children()
        .contains('Add interaction')
        .click()
      cy.location('pathname').should('eq', addInteractionUrlAllOverview)
      cy.go('back')
    })
    it('the card should contain two activities', () => {
      cy.get('[data-test="Upcoming activityCardContainer"]')
        .find('ol')
        .children()
        .should('have.length', 2)
    })
    it('the card should link to the activity overview page', () => {
      cy.get('[data-test="Recent activityCardContainer"]')
        .contains('View all activities')
        .click()
      cy.location('pathname').should('eq', allActivityUrlAllOverview)
      cy.go('back')
    })
  })

  context(
    'when viewing the Upcoming Activities Card for a business with no activities',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })

      it('the card should contain the upcoming activity heading and add interaction link', () => {
        cy.get('[data-test="Upcoming activityCardContainer"]')
          .children()
          .first()
          .contains('Upcoming activity')
          .children()
          .contains('Add interaction')
          .click()
        cy.location('pathname').should('eq', addInteractionUrlNoOverview)
        cy.go('back')
        cy.get('[data-test="noActivities"]').contains(
          'There are no activities to show.'
        )
      })
    }
  )

  context('when viewing all activity cards types', () => {
    before(() => {
      cy.visit(urls.companies.overview.index(fixtures.company.venusLtd.id))
    })

    it('should display aventri event activity,', () => {
      cy.get('[data-test="aventri-event-summary"]')
        .children()
        .first()
        .contains('02 Mar 2021 to 04 May 2022')
        .next()
        .children()
        .contains('Aventri Event')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'EITA Test Event 2022')
    })
    it('should display exporters record activity,', () => {
      cy.get('[data-test="hmrc-exporter-activity-summary"]')
        .children()
        .first()
        .contains('01 Oct 2019')
        .next()
        .children()
        .contains('Exporters Record')
      cy.get('[data-test="activity-summary-subject"]')
        .contains('Export of goods outside the EU')
        .next()
        .contains('HMRC Update')
    })
    it('should display company activity,', () => {
      cy.get('[data-test="companies-house-company-activity"]')
        .children()
        .first()
        .contains('11 Jan 1865')
        .next()
        .children()
        .contains('Company Record')
      cy.get('[data-test="activity-summary-subject"]')
        .contains('Company officially incorporated in Companies House')
        .next()
        .contains('Companies House Updated')
    })
    it('should display accountss record activity,', () => {
      cy.get('[data-test="companies-house-account-activity-summary"]')
        .children()
        .first()
        .contains('30 Jun 2011')
        .next()
        .children()
        .contains('Accounts Record')
      cy.get('[data-test="activity-summary-subject"]')
        .contains('Company accounts made up')
        .next()
        .contains('Companies House Updated')
    })
    it('should display new order activity,', () => {
      cy.get('[data-test="omis-activity-summary"]')
        .children()
        .first()
        .contains('25 Mar 2013')
        .next()
        .children()
        .contains('New Order')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'HAM100')
        .parent()
        .next()
        .contains('Export to United States added by Angelica Schuyler')
    })
    it('should display outstanding referral,', () => {
      cy.get('[data-test="referral-summary"]')
        .children()
        .first()
        .contains('21 May 2020')
        .next()
        .children()
        .contains('Outstanding referral')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'Support needs in the Planet')
        .parent()
        .next()
        .contains(
          'Completed sending adviser John Doe, Planet Consulate General receiving adviser John Taylorme, Planet Embassy'
        )
    })
    it('should display interaction,', () => {
      cy.get('[data-test="export-support-service-summary"]')
        .children()
        .first()
        .contains('02 Dec 2022')
        .next()
        .children()
        .contains('Interaction')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'Enquiring about Exporting some things')
        .parent()
        .next()
        .contains('Enquirer')
    })
    it('should display data hub event,', () => {
      cy.get('[data-test="data-hub-event-summary"]')
        .children()
        .first()
        .contains('30 May to 14 Jun 2022')
        .next()
        .children()
        .contains('Account management')
      cy.get('[data-test="activity-summary-subject"]')
        .children()
        .contains('a', 'Holiday to the Seaside')
        .parent()
        .next()
        .contains('Joe Bloggs organised Best service')
    })
  })

  context(
    'when viewing the active investment projects card for a business that has all information added',
    () => {
      before(() => {
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })

      it('the card should contain a message outlining three active investments', () => {
        cy.get('[data-test="estimated-land-date-new-rollercoaster-header"]', {
          timeout: 1000,
        }).should('be.visible')
        cy.get('[data-test="activeInvestmentProjectsContainer"]')
          .children()
          .first()
          .contains('Active investment projects')
          .next()
          .children()
          .first()
          .contains('New rollercoaster')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.investments.projects.details(
            '0e686ea4-b8a2-4337-aec4-114d92ad4588'
          )}`
        )
        cy.go('back')
        cy.get('[data-test="estimated-land-date-new-rollercoaster-header"]')
          .next()
          .contains('May 2024')
        cy.get('[data-test="last-interaction-date-new-rollercoaster-header"]')
          .next()
          .contains('Not set')
        cy.get('[data-test="likelihood-of-landing-new-rollercoaster-header"]')
          .next()
          .contains('High')
        cy.get('[data-test="active-investment-edit-new-rollercoaster-link"]')
          .contains('Edit')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.investments.projects.editDetails(
            '0e686ea4-b8a2-4337-aec4-114d92ad4588'
          )}`
        )
        cy.get('[data-test="field-likelihood_to_land"]').type('Low').click()
        cy.go('back')
        cy.get('[data-test="active-investment-page-new-restaurant-link"]')
          .contains('New restaurant')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.investments.projects.details(
            '18750b26-a8c3-41b2-8d3a-fb0b930c2270'
          )}`
        )
        cy.go('back')
        cy.get('[data-test="estimated-land-date-new-restaurant-header"]')
          .next()
          .contains('October 2025')
        cy.get('[data-test="likelihood-of-landing-new-restaurant-header"]')
          .next()
          .contains('Medium')
        cy.get('[data-test="active-investment-edit-new-restaurant-link"]')
          .contains('Edit')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.investments.projects.editDetails(
            '18750b26-a8c3-41b2-8d3a-fb0b930c2270'
          )}`
        )
        cy.get('[data-test="field-likelihood_to_land"]').type('Low').click()
        cy.go('back')
        cy.get('[data-test="last-interaction-date-new-restaurant-header"]')
          .next()
          .contains('16 March 2021')
          .click()
        cy.location('pathname').should(
          'eq',
          `${interactionUrlAllOverview}/3fd90013-4bcb-4c39-b8df-df264471ea85`
        )
        cy.go('back')
        cy.get('[data-test="estimated-land-date-wig-factory-header"]')
          .next()
          .contains('January 2026')
        cy.get('[data-test="likelihood-of-landing-wig-factory-header"]')
          .next()
          .contains('Low')
        cy.get('[data-test="active-investment-edit-wig-factory-link"]')
          .contains('Edit')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.investments.projects.editDetails(
            '3520b973-0e77-46cf-be75-3585f2f6691e'
          )}`
        )
        cy.get('[data-test="field-likelihood_to_land"]').type('Low').click()
        cy.go('back')
        cy.get('[data-test="active-investment-page-wig-factory-link"]')
          .contains('Wig factory')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.investments.projects.details(
            '3520b973-0e77-46cf-be75-3585f2f6691e'
          )}`
        )
        cy.go('back')
        cy.get('[data-test="last-interaction-date-wig-factory-header"]')
          .next()
          .contains('16 March 2021')
          .click()
        cy.location('pathname').should(
          'eq',
          `${interactionUrlAllOverview}/3fd90013-4bcb-4c39-b8df-df264471ea85`
        )
        cy.go('back')
      })
      it('the card should link to the investment page', () => {
        cy.get('[data-test="active-investments-page-link"]')
          .contains('View 1 more active investment')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.companies.investments.companyInvestmentProjects(
            'ba8fae21-2895-47cf-90ba-9273c94dab88'
          )}`
        )
        cy.go('back')
      })
    }
  )
  context(
    'when viewing the active investment projects card for a business that has an investment but no status',
    () => {
      before(() => {
        cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
          body: {
            count: 1,
            results: [
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                latest_interaction: {
                  date: '2021-03-16T00:00:00+00:00',
                  subject: 'A project interaction',
                  id: '3fd90013-4bcb-4c39-b8df-df264471ea85',
                },
                name: 'New restaurant',
                status: 'ongoing',
              },
            ],
          },
        }).as('apiRequest')
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })
      it('the card should contain that the status of the investment is Not set', () => {
        cy.get('[data-test="activeInvestmentProjectsContainer"]')
          .children()
          .first()
          .contains('Active investment projects')
        cy.get('[data-test="likelihood-of-landing-new-restaurant-header"]')
          .next()
          .contains('Not set')
      })
    }
  )
  context(
    'when viewing the active investment projects card only ongoing or delayed investments are viewable',
    () => {
      before(() => {
        cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
          body: {
            count: 4,
            results: [
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Ongoing',
                status: 'ongoing',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Delayed',
                status: 'delayed',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Lost',
                status: 'lost',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Won',
                status: 'won',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Abandoned',
                status: 'abandoned',
              },
              {
                likelihood_to_land: null,
                stage: {
                  id: '7606cc19-20da-4b74-aba1-2cec0d753ad8',
                  name: 'Active',
                },
                estimated_land_date: '2025-10-13',
                name: 'Active Dormant',
                status: 'dormant',
              },
            ],
          },
        }).as('apiRequest')
        cy.visit(
          urls.companies.overview.index(fixtures.company.allOverviewDetails.id)
        )
      })
      it('the card should contact two active investments only', () => {
        cy.get(
          '[data-test="active-investment-page-active-ongoing-link"]'
        ).contains('Active Ongoing')
        cy.get(
          '[data-test="active-investment-page-active-delayed-link"]'
        ).contains('Active Delayed')
      })
      it('the card should contain a link stating 4 more active investments', () => {
        cy.get('[data-test="active-investments-page-link"]').contains(
          'View 4 more active investments'
        )
      })
    }
  )
  context(
    'when viewing the active investment projects card for a business that has no investment projects',
    () => {
      before(() => {
        cy.intercept('POST', '/api-proxy/v3/search/investment_project', {
          body: {
            results: noActiveInvestments,
          },
        }).as('apiRequest')
        cy.visit(
          urls.companies.overview.index(fixtures.company.noOverviewDetails.id)
        )
      })
      it('the card should contain a message outling there are no active investments', () => {
        cy.get('[data-test="activeInvestmentProjectsContainer"]')
          .children()
          .first()
          .contains('Active investment projects')
          .next()
          .children()
          .contains('There are no active investments')
      })
      it('the card should link to the investment page', () => {
        cy.get('[data-test="investments-page-link"]')
          .contains('View all investments')
          .click()
        cy.location('pathname').should(
          'eq',
          `${urls.companies.investments.companyInvestmentProjects(
            '1111ae21-2895-47cf-90ba-9273c94dab88'
          )}`
        )
        cy.go('back')
      })
    }
  )
})
