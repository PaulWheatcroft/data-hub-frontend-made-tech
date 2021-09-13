import axios from 'axios'
import { apiProxyAxios } from '../../../client/components/Task/utils'

import urls from '../../../lib/urls'
import { getMetadataOptions } from '../../../client/metadata'
import { getPageOffset } from '../../../lib/pagination'

import {
  transformResponseToEventCollection,
  transformResponseToEventDetails,
} from './transformers'

const handleError = (error) => Promise.reject(Error(error.response.data.detail))

const getEvents = ({
  limit = 10,
  page,
  sortby = 'modified_on:desc',
  name,
  organiser,
  start_date_before,
  start_date_after,
  address_country,
  uk_region,
  event_type,
}) =>
  axios
    .post('/api-proxy/v3/search/event', {
      limit,
      offset: getPageOffset({ limit, page }),
      sortby,
      name,
      organiser,
      start_date_before,
      start_date_after,
      address_country,
      uk_region,
      event_type,
    })
    .then(({ data }) => transformResponseToEventCollection(data))
    .catch(handleError)

const getEventsMetadata = () =>
  Promise.all([
    getMetadataOptions(urls.metadata.country()),
    getMetadataOptions(urls.metadata.ukRegion(), { filterDisabled: false }),
    getMetadataOptions(urls.metadata.eventType(), { filterDisabled: false }),
  ])
    .then(([countryOptions, ukRegionOptions, eventTypeOptions]) => ({
      countryOptions,
      ukRegionOptions,
      eventTypeOptions,
    }))
    .catch(handleError)

const getEventDetails = (eventId) =>
  apiProxyAxios
    .get(`/api-proxy/v3/event/${eventId}`)
    .then(({ data }) => transformResponseToEventDetails(data))
    .catch(handleError)

export { getEvents, getEventsMetadata, getEventDetails }
