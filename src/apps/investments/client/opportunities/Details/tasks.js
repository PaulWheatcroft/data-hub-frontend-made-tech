import { apiProxyAxios } from '../../../../../client/components/Task/utils'
import { transformValueForAPI } from '../../../../../client/utils/date'

import { transformInvestmentOpportunityDetails } from './transformers'

export const idNameToValueLabel = ({ id, name }) => ({ value: id, label: name })

export const getOpportunityDetails = ({ opportunityId }) =>
  apiProxyAxios
    .get(`/v4/large-capital-opportunity/${opportunityId}`)
    .then(({ data }) => transformInvestmentOpportunityDetails(data))

export const getDetailsMetadata = () =>
  Promise.all([
    apiProxyAxios.get('/v4/metadata/uk-region'),
    apiProxyAxios.get(
      '/v4/metadata/capital-investment/required-checks-conducted'
    ),
    apiProxyAxios.get('/v4/metadata/capital-investment/asset-class-interest'),
    apiProxyAxios.get('/v4/metadata/capital-investment/construction-risk'),
    apiProxyAxios.get(
      '/v4/metadata/large-capital-opportunity/opportunity-value-type'
    ),
  ]).then(
    ([
      { data: ukRegions },
      { data: requiredChecksConducted },
      { data: classes },
      { data: constructionRisks },
      { data: valueTypes },
    ]) => ({
      ukRegions: ukRegions
        .filter((region) => !region.disabled_on)
        .map(idNameToValueLabel),
      requiredChecksConducted: requiredChecksConducted.map(idNameToValueLabel),
      classesOfInterest: classes.map(idNameToValueLabel),
      constructionRisks: constructionRisks.map(idNameToValueLabel),
      valueTypes: valueTypes.map(idNameToValueLabel),
    })
  )

export const getRequirementsMetadata = () =>
  Promise.all([
    apiProxyAxios.get(
      'v4/metadata/capital-investment/large-capital-investment-type'
    ),
    apiProxyAxios.get('/v4/metadata/capital-investment/return-rate'),
    apiProxyAxios.get('/v4/metadata/capital-investment/time-horizon'),
  ]).then(
    ([
      { data: investmentTypes },
      { data: returnRates },
      { data: timeScales },
    ]) => ({
      investmentTypes: investmentTypes.map(idNameToValueLabel),
      returnRates: returnRates.map(idNameToValueLabel),
      timeScales: timeScales.map(idNameToValueLabel),
    })
  )

export function saveOpportunityDetails({ values, opportunityId }) {
  return apiProxyAxios
    .patch(`v4/large-capital-opportunity/${opportunityId}`, {
      name: values.name,
      description: values.description,
      uk_region_locations: values.ukRegions?.map(({ value }) => value),
      promoters: values.promoters?.map(({ value }) => value),
      required_checks_conducted: values.requiredChecksConducted
        ? values.requiredChecksConducted
        : undefined,
      required_checks_conducted_by: values.requiredChecksConductedBy?.value,
      required_checks_conducted_on: values.requiredChecksConductedOn
        ? transformValueForAPI(values.requiredChecksConductedOn)
        : undefined,
      lead_dit_relationship_manager: values.leadRelationshipManager?.value,
      other_dit_contacts: values.otherDitContacts?.map(({ value }) => value),
      asset_classes: values.assetClasses?.map(({ value }) => value),
      opportunity_value: values.opportunityValue
        ? values.opportunityValue
        : undefined,
      // TODO: refactor this to not be in an array once the API is fixed.
      construction_risks: values.constructionRisks.length
        ? [values.constructionRisks]
        : [],
      opportunity_value_type: values.valueType ? values.valueType : undefined,
    })
    .then(({ data }) => transformInvestmentOpportunityDetails(data))
}

export function saveOpportunityRequirements({ values, opportunityId }) {
  return apiProxyAxios
    .patch(`v4/large-capital-opportunity/${opportunityId}`, {
      total_investment_sought: values.total_investment_sought,
      current_investment_secured: values.current_investment_secured,
      investment_types: values.investment_types,
      estimated_return_rate: values.estimated_return_rate,
      // TODO: Remove array bracket after refactoring endpoint.
      time_horizons: values.time_horizons ? [values.time_horizons] : [],
    })
    .then(({ data }) => transformInvestmentOpportunityDetails(data))
}

export function saveOpportunityStatus({ values, opportunityId }) {
  return apiProxyAxios
    .patch(`v4/large-capital-opportunity/${opportunityId}`, {
      status: values.status,
    })
    .then(({ data }) => transformInvestmentOpportunityDetails(data))
}
