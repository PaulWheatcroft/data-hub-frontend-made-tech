import urls from '../../../../../src/lib/urls'
import { capitalize } from 'lodash'
import { currencyGBP } from '../../../../../src/client/utils/number-utils'
import { format } from '../../../../../src/client/utils/date'

const {
  assertBreadcrumbs,
  assertKeyValueTable,
  assertUrl,
} = require('../../support/assertions')

const { exportItems } = require('../../../../sandbox/routes/v4/export/exports')

describe('Export Details summary ', () => {
  const exportItem = exportItems.results[0]
  Context('when summary table renders', () => {
    beforeEach(() => {
      cy.intercept('GET', `/api-proxy/v4/export/${exportItem.id}`, {
        body: exportItem,
      }).as('getExportItemApiRequest')
      cy.visit(`/export/${exportItem.id}/details`)
    })

    it('should render breadcrumbs', () => {
      assertBreadcrumbs({
        Home: urls.dashboard(),
        [exportItem.title]: null,
      })
    })

    it('should display the "Export" details summary table', () => {
      const estimatedExportValue = `${
        exportItem.estimated_export_value_years?.name
      } / ${currencyGBP(exportItem.estimated_export_value_amount)}`

      const estimatedWinDate = format(
        exportItem.estimated_win_date.toISOString(),
        'MMMM yyyy'
      )
      assertKeyValueTable('bodyMainContent', {
        'Export title': exportItem.title,
        Owner: exportItem.owner.name,
        'Team members': exportItem.team_members.map((obj) => obj.name).join(''),
        'Total estimated export value': estimatedExportValue,
        'Estimated date for Win': estimatedWinDate,
        Status: capitalize(exportItem.status),
        'Export potential': capitalize(exportItem.export_potential),
        Destination: exportItem.destination_country.name,
        'Main sector': exportItem.sector.name,
        'Exporter experience': exportItem.exporter_experience.name,
        'Company contacts': exportItem.contacts.map((obj) => obj.name).join(''),
        Notes: exportItem.notes,
      })
    })
  })

  context.only('when the form edit button is clicked', () => {
    const exportDetailsUrl = `/export/${exportItem.id}/details`
    it('the form should redirect to the edit page', () => {
      cy.get('[data-test="edit-export-details-button"]').click()
      assertUrl(urls.exportPipeline.edit())
    })
  })

  context('when the form delete button is clicked', () => {
    it('the form should redirect to the delete page', () => {
      cy.get('[data-test="delete-button"]').click()
      assertUrl(urls.exportPipeline.delete())
    })
  })
})
