import React from 'react'
import PropTypes from 'prop-types'
import Details from '@govuk-react/details'
import Link from '@govuk-react/link'
import { get } from 'lodash'
import styled from 'styled-components'
import { SPACING_POINTS } from '@govuk-react/constants'
import { StatusMessage, DateUtils } from 'data-hub-components'

import SectionAbout from './SectionAbout'
import SectionAddresses from './SectionAddresses'
import SectionHierarchy from './SectionHierarchy'
import SectionRegion from './SectionRegion'
import SectionSector from './SectionSector'
import SectionOneList from './SectionOneList'
import SectionDocuments from './SectionDocuments'
import SectionArchive from './SectionArchive'

const StyledRoot = styled('div')`
  & > table {
    margin-top: ${SPACING_POINTS[8]}px;
    margin-bottom: ${SPACING_POINTS[8]}px;
  }
`

const getArchivedBy = ({ archived_by, archived_on }) => {
  const dateStr = DateUtils.format(archived_on)
  if (archived_by) {
    const { first_name, last_name } = archived_by
    return `This company was archived on ${dateStr} by ${first_name} ${last_name}`
  }
  return `This company was automatically archived on ${dateStr}.`
}

const CompanyBusinessDetails = ({
  businessDetails,
  subsidiariesCount,
  dnbRelatedCompaniesCount,
  globalUltimate,
  isGlobalUltimateFlagEnabled,
  urls,
}) => {
  const isGlobalHQ = get(businessDetails, 'headquarter_type.name') === 'ghq'
  const isGlobalUltimate = !!businessDetails.is_global_ultimate
  const isDnbCompany = !!businessDetails.duns_number
  const isArchived = !!businessDetails.archived
  const isBasedInUK = !!businessDetails.uk_based
  const lastUpdated =
    businessDetails.dnb_modified_on ||
    businessDetails.modified_on ||
    businessDetails.created_on

  return (
    <StyledRoot>
      <div>
        This page shows information about this business and how it is related to
        other businesses.
      </div>
      <div>
        Changes made to this information can be found on the{' '}
        <Link href={urls.companyEditHistory}>Edit history page</Link>.
      </div>
      {lastUpdated && (
        <div>Last updated on: {DateUtils.format(lastUpdated)}</div>
      )}

      {isArchived && (
        <StatusMessage>
          <p>{getArchivedBy(businessDetails)}</p>
          <p>
            <strong>Reason:</strong> {businessDetails.archived_reason}
          </p>
          <p>
            <Link href={urls.companyUnarchive}>Unarchive</Link>
          </p>
        </StatusMessage>
      )}

      {isDnbCompany && (
        <Details
          summary="Are these business details right?"
          data-auto-id="businessDetailsWhereDoesInformation"
        >
          <p>
            Most business details have been verified by trusted third-parties to
            keep them updated automatically. Business description, region and
            sector are not updated by third parties.
          </p>
          <p>
            <strong>Think some details are wrong?</strong> ‘Edit’ and ‘Submit’
            new details for review.
          </p>
        </Details>
      )}

      <SectionAbout
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />

      <SectionAddresses
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />

      <SectionRegion
        businessDetails={businessDetails}
        isArchived={isArchived}
        isBasedInUK={isBasedInUK}
        urls={urls}
      />

      <SectionSector
        businessDetails={businessDetails}
        isArchived={isArchived}
        urls={urls}
      />

      <SectionOneList
        businessDetails={businessDetails}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />

      <SectionHierarchy
        businessDetails={businessDetails}
        subsidiariesCount={subsidiariesCount}
        dnbRelatedCompaniesCount={dnbRelatedCompaniesCount}
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        isGlobalUltimate={isGlobalUltimate}
        isGlobalHQ={isGlobalHQ}
        isGlobalUltimateFlagEnabled={isGlobalUltimateFlagEnabled}
        globalUltimate={globalUltimate}
        urls={urls}
      />

      <SectionDocuments urls={urls} />

      <SectionArchive
        isArchived={isArchived}
        isDnbCompany={isDnbCompany}
        urls={urls}
      />
    </StyledRoot>
  )
}

CompanyBusinessDetails.propTypes = {
  businessDetails: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
  subsidiariesCount: PropTypes.number,
  dnbRelatedCompaniesCount: PropTypes.number,
  globalUltimate: PropTypes.object.isRequired,
  isGlobalUltimateFlagEnabled: PropTypes.bool.isRequired,
}

CompanyBusinessDetails.defaultProps = {
  subsidiariesCount: 0,
  dnbRelatedCompaniesCount: 0,
}

export default CompanyBusinessDetails
