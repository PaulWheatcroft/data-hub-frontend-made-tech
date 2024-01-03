/* eslint-disable camelcase */

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Step, FieldSelect } from '../../../../../client/components'
import Task from '../../../../../client/components/Task'
import { ADD_COMPANY__REGION_LOADED } from '../../../../../client/actions'
import { ID, TASK_POSTCODE_TO_REGION } from './state'

function CompanyRegionAndSector({ regions, region, sectors, isUK, postcode }) {
  return (
    <Step name="companyRegionAndSector" forwardButton="Add company">
      {isUK && (
        <Task.Status
          name={TASK_POSTCODE_TO_REGION}
          id={ID}
          startOnRender={{
            payload: postcode,
            onSuccessDispatch: ADD_COMPANY__REGION_LOADED,
          }}
        >
          {() =>
            region && (
              <FieldSelect
                name="uk_region"
                label="DBT region"
                initialValue={region.value}
                emptyOption="-- Select DBT region --"
                options={regions}
                required="Select DBT region"
              />
            )
          }
        </Task.Status>
      )}
      <FieldSelect
        name="sector"
        label="DBT sector"
        emptyOption="-- Select DBT sector --"
        options={sectors}
        required="Select DBT sector"
      />
    </Step>
  )
}

CompanyRegionAndSector.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  sectors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
  isUK: PropTypes.bool.isRequired,
}

export default connect(
  ({ addCompany }, { regions, sectors, isUK, postcode }) => {
    const { region } = addCompany
    return {
      regions,
      region,
      sectors,
      isUK,
      postcode,
    }
  }
)(CompanyRegionAndSector)
