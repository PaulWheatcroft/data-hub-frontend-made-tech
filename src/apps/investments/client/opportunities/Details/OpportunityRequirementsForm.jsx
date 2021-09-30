import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Button from '@govuk-react/button'
import Link from '@govuk-react/link'
import { SPACING } from '@govuk-react/constants'
import url from '../../../../../lib/urls'

import {
  ID,
  state2props,
  TASK_SAVE_OPPORTUNITY_REQUIREMENTS,
  TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA,
} from './state'
import {
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
  INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE,
} from '../../../../../client/actions'

import Task from '../../../../../client/components/Task'
import {
  Main,
  FieldInput,
  FieldCheckboxes,
  FieldRadios,
  FormActions,
  MultiInstanceForm,
} from '../../../../../client/components'
import {
  TOTAL_INVESTMENT_SOUGHT_FIELD_NAME,
  CURRENT_INVESTMENT_SECURED_FIELD_NAME,
  INVESTMENT_TYPES_FIELD_NAME,
  ESTIMATED_RETURN_RATE_FIELD_NAME,
  TIME_HORIZONS_FIELD_NAME,
} from '../Details/constants'

const StyledFieldCheckboxes = styled(FieldCheckboxes)`
  margin-bottom: 0;
`

const StyledP = styled('p')`
  margin-bottom: ${SPACING.SCALE_5};
`

const IS_NUMBER = /^[0-9]*$/ // Input validation to eliminates input script injection

const OpportunityRequirementsForm = (state) => {
  const { opportunityId, opportunity, metadata } = state
  const {
    totalInvestmentSought,
    currentInvestmentSecured,
    investmentTypes: investmentTypesValues,
    returnRate: returnRateValues,
    timeHorizons: timeHorizonsValues,
  } = opportunity.requirementsFields

  const {
    investmentTypes: investmentTypesOptions,
    returnRates: returnRatesOptions,
    timeScales: timeScalesOptions,
  } = metadata

  return (
    <Task>
      {(getTask) => {
        const saveRequirementsTask = getTask(
          TASK_SAVE_OPPORTUNITY_REQUIREMENTS,
          ID
        )
        return (
          <Task.Status
            name={TASK_GET_OPPORTUNITY_REQUIREMENTS_METADATA}
            id={ID}
            startOnRender={{
              onSuccessDispatch:
                INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED,
            }}
          >
            {() =>
              !!metadata.investmentTypes.length && (
                <>
                  <Main>
                    <MultiInstanceForm
                      id={ID}
                      onSubmit={(values) => {
                        saveRequirementsTask.start({
                          payload: { values, opportunityId },
                          onSuccessDispatch:
                            INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE,
                        })
                      }}
                    >
                      <FieldInput
                        label="Total investment sought"
                        hint="Enter value in £"
                        name={TOTAL_INVESTMENT_SOUGHT_FIELD_NAME}
                        initialValue={totalInvestmentSought}
                        type="text"
                        validate={(value) =>
                          !value || IS_NUMBER.test(value)
                            ? null
                            : 'Total investment sought value must be a number'
                        }
                      />
                      <FieldInput
                        label="Investment secured so far"
                        hint="Enter value in £"
                        name={CURRENT_INVESTMENT_SECURED_FIELD_NAME}
                        initialValue={currentInvestmentSecured}
                        type="text"
                        validate={(value) =>
                          !value || IS_NUMBER.test(value)
                            ? null
                            : 'Investment secured so far value must be a number'
                        }
                      />
                      <StyledFieldCheckboxes
                        legend="Types of investment"
                        name={INVESTMENT_TYPES_FIELD_NAME}
                        initialValue={investmentTypesValues.map(
                          (obj) => obj.value
                        )}
                        options={investmentTypesOptions}
                        data-test="types-of-investment"
                      />
                      <StyledP>
                        If you can’t see the type of investment you need,
                        request it from{' '}
                        <Link>capitalinvestment@trade.gov.uk</Link>.
                      </StyledP>
                      <FieldRadios
                        legend="Estimated return rate"
                        name={ESTIMATED_RETURN_RATE_FIELD_NAME}
                        initialValue={
                          returnRateValues && returnRateValues.value
                        }
                        options={returnRatesOptions}
                        data-test="estimated-return-rate"
                      />
                      <FieldRadios
                        legend="Timescales"
                        name={TIME_HORIZONS_FIELD_NAME}
                        initialValue={timeHorizonsValues[0]?.value}
                        options={timeScalesOptions}
                        data-test="timescales"
                      />
                      <FormActions>
                        <Button data-test="edit-button">Save</Button>
                        <Link
                          href={url.investments.opportunities.details(
                            opportunityId
                          )}
                        >
                          Cancel
                        </Link>
                      </FormActions>
                    </MultiInstanceForm>
                  </Main>
                </>
              )
            }
          </Task.Status>
        )
      }}
    </Task>
  )
}

OpportunityRequirementsForm.propTypes = {
  opportunityId: PropTypes.string.isRequired,
}
export default connect(state2props)(OpportunityRequirementsForm)
