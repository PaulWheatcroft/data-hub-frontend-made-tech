import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import pluralize from 'pluralize'
import GridCol from '@govuk-react/grid-col'
import GridRow from '@govuk-react/grid-row'
import Link from '@govuk-react/link'
import { SPACING, FONT_SIZE, BREAKPOINTS } from '@govuk-react/constants'
import { GREY_3 } from 'govuk-colours'
import Details from '@govuk-react/details'
import Main from '@govuk-react/main'
import { Badge, StatusMessage, DateUtils } from 'data-hub-components'

import LocalHeader from '../../../client/components/LocalHeader/LocalHeader'
import LocalHeaderHeading from '../../../client/components/LocalHeader/LocalHeaderHeading'
import SecondaryButton from '../../../client/components/SecondaryButton.jsx'
import formatAddress from '../../../client/utils/formatAddress'
import { companies } from '../../../lib/urls'

const StyledAddress = styled('p')`
  margin-top: ${SPACING.SCALE_2};
  margin-bottom: ${SPACING.SCALE_2};
`

const BadgeText = styled('span')`
  font-weight: 600;
  font-size: ${FONT_SIZE.SIZE_16};
`

const TypeWrapper = styled('div')`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    display: table-row;
  }
`

const BadgeWrapper = styled('div')`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    display: table-cell;
  }
`

const StyledDetails = styled(Details)`
  @media (min-width: ${BREAKPOINTS.TABLET}) {
    margin: 0 0 0 ${SPACING.SCALE_3};
  }
  span,
  div {
    font-size: ${FONT_SIZE.SIZE_16};
  }
`

const StyledDescription = styled('div')`
  padding: ${SPACING.SCALE_2};
  background-color: ${GREY_3};

  * + & {
    margin-top: ${SPACING.SCALE_3};
  }

  p {
    margin-top: 0;
    margin-bottom: 0;

    &:not(:last-child) {
      margin-bottom: ${SPACING.SCALE_2};
    }
  }

  & + * {
    margin-top: ${SPACING.SCALE_3};
  }
`

const StyledMain = styled(Main)`
  padding-top: ${SPACING.SCALE_1};
  div {
    font-size: ${FONT_SIZE.SIZE_20};
  }
`

const CompanyLocalHeader = ({
  breadcrumbs,
  flashMessages,
  company,
  dnbRelatedCompaniesCount,
  returnUrl,
}) => {
  const queryString = returnUrl ? `${returnUrl}` : `/companies/${company.id}`

  return (
    <>
      <LocalHeader breadcrumbs={breadcrumbs} flashMessages={flashMessages}>
        <GridRow>
          <GridCol setWidth="two-thirds">
            <LocalHeaderHeading data-auto-id="heading">
              {company.name}
            </LocalHeaderHeading>
            <StyledAddress data-auto-id="address">
              {formatAddress([
                company.address.line_1,
                company.address.line_2,
                company.address.town,
                company.address.county,
                company.address.postcode,
                company.address.country.name,
              ])}
            </StyledAddress>
          </GridCol>
          <GridCol setWith="one-third">
            <SecondaryButton
              as={Link}
              href={`/companies/${company.id}/lists/add-remove?returnUrl=${queryString}`}
            >
              Add to or remove from lists
            </SecondaryButton>
          </GridCol>
        </GridRow>
        {(company.isUltimate || company.isGlobalHQ) && (
          <TypeWrapper>
            <BadgeWrapper>
              <Badge>
                <BadgeText data-auto-id="badge">
                  {company.isUltimate ? 'Ultimate HQ' : 'Global HQ'}
                </BadgeText>
              </Badge>
            </BadgeWrapper>
            {company.isUltimate && (
              <StyledDetails
                summary="What does this mean?"
                data-auto-id="metaList"
              >
                This HQ is in control of all related company records for{' '}
                {company.name}.
              </StyledDetails>
            )}
          </TypeWrapper>
        )}
        {(dnbRelatedCompaniesCount || company.hasManagedAccountDetails) && (
          <StyledDescription data-auto-id="description">
            {dnbRelatedCompaniesCount && (
              <p>
                Data Hub contains{' '}
                <a href={companies.dnbHierarchy.index(company.id)}>
                  {dnbRelatedCompaniesCount} other company{' '}
                  {pluralize('record', dnbRelatedCompaniesCount)}
                </a>{' '}
                related to this company
              </p>
            )}
            {company.hasManagedAccountDetails && (
              <>
                <p>
                  This is an account managed company (One List{' '}
                  {company.one_list_group_tier.name})
                </p>
                <p>
                  {company.isItaTierDAccount
                    ? 'Lead ITA'
                    : 'Global Account Manager'}
                  : {company.one_list_group_global_account_manager.name}{' '}
                  <a href={companies.advisers.index(company.id)}>
                    {company.isItaTierDAccount
                      ? 'View Lead adviser'
                      : 'View core team'}
                  </a>
                </p>
              </>
            )}
          </StyledDescription>
        )}
        <p>
          <a href={companies.businessDetails(company.id)}>
            View full business details
          </a>
        </p>
      </LocalHeader>

      {company.archived && (
        <StyledMain>
          <StatusMessage>
            {company.archived_by
              ? `This company was archived on ${DateUtils.format(
                  company.archived_on
                )} by ${company.archived_by.first_name} ${
                  company.archived_by.last_name
                }.`
              : `This company was automatically archived on ${DateUtils.format(
                  company.archived_on
                )}.`}
            <br />
            <strong>Reason:</strong> {company.archived_reason}
            <br />
            <br />
            <a href={companies.unarchive(company.id)}>Unarchive</a>
          </StatusMessage>
        </StyledMain>
      )}

      {company.pending_dnb_investigation && (
        <StyledMain>
          This company record is based on information that has not yet been
          validated. This information is currently being checked by the Data Hub
          support team.
        </StyledMain>
      )}
    </>
  )
}

CompanyLocalHeader.propTypes = {
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      link: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  flashMessages: PropTypes.shape({
    type: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          body: PropTypes.string.isRequired,
          heading: PropTypes.string.isRequired,
          id: PropTypes.string,
        })
      ),
      PropTypes.arrayOf(PropTypes.string).isRequired,
    ]),
  }),
  company: PropTypes.object.isRequired,
  dnbRelatedCompaniesCount: PropTypes.number,
  returnUrl: PropTypes.string,
}

CompanyLocalHeader.defaultProps = {
  flashMessages: null,
  dnbRelatedCompaniesCount: null,
  returnUrl: null,
}

export default CompanyLocalHeader
