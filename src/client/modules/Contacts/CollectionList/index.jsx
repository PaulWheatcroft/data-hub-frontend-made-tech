import React from 'react'
import { connect } from 'react-redux'
import { LABELS } from './constants'

import { CONTACTS__LOADED, CONTACTS__METADATA_LOADED } from '../../../actions'

import {
  RoutedTypeahead,
  RoutedInputField,
  CollectionFilters,
  FilteredCollectionList,
  RoutedCheckboxGroupField,
  DefaultLayout,
} from '../../../components'

import {
  listSkeletonPlaceholder,
  filterSkeletonPlaceholder,
} from '../../../components/SkeletonPlaceholder'

import {
  CONTACTS_LIST_ID,
  contactsState2props,
  TASK_GET_CONTACTS_LIST,
  TASK_GET_CONTACTS_METADATA,
} from './state'

const ContactsCollection = ({
  payload,
  optionMetadata,
  selectedFilters,
  ...props
}) => {
  const collectionListTask = {
    name: TASK_GET_CONTACTS_LIST,
    id: CONTACTS_LIST_ID,
    progressMessage: 'Loading contacts',
    renderProgress: listSkeletonPlaceholder(),
    startOnRender: {
      payload,
      onSuccessDispatch: CONTACTS__LOADED,
    },
  }

  const collectionListMetadataTask = {
    name: TASK_GET_CONTACTS_METADATA,
    id: CONTACTS_LIST_ID,
    progressMessage: 'Loading filters',
    renderProgress: filterSkeletonPlaceholder({
      filterCheckboxCount: 0,
      filterInputFields: 6,
    }),
    startOnRender: {
      onSuccessDispatch: CONTACTS__METADATA_LOADED,
    },
  }

  return (
    <DefaultLayout heading="Contacts" pageTitle="Contacts">
      <FilteredCollectionList
        {...props}
        collectionName="contacts"
        sortOptions={optionMetadata.sortOptions}
        taskProps={collectionListTask}
        selectedFilters={selectedFilters}
        baseDownloadLink="/contacts/export"
        entityName="contact"
      >
        <CollectionFilters taskProps={collectionListMetadataTask}>
          <RoutedInputField
            id="ContactsCollection.name"
            qsParam="name"
            name="name"
            label={LABELS.contactName}
            placeholder="Search contact name"
            data-test="contact-name-filter"
          />
          <RoutedInputField
            id="ContactsCollection.company-name"
            qsParam="company_name"
            name="company_name"
            label={LABELS.companyName}
            placeholder="Search company name"
            data-test="company-name-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label={LABELS.sector}
            name="sector"
            qsParam="company_sector_descends"
            placeholder="Search sector"
            options={optionMetadata.sectorOptions}
            selectedOptions={selectedFilters.companySectors.options}
            data-test="sector-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label={LABELS.country}
            name="country"
            qsParam="address_country"
            placeholder="Search country"
            options={optionMetadata.countryOptions}
            selectedOptions={selectedFilters.addressCountries.options}
            data-test="country-filter"
          />
          <RoutedTypeahead
            isMulti={true}
            label={LABELS.ukRegion}
            name="uk_region"
            qsParam="company_uk_region"
            placeholder="Search UK region"
            options={optionMetadata.ukRegionOptions}
            selectedOptions={selectedFilters.companyUkRegions.options}
            data-test="uk-region-filter"
          />
          <RoutedCheckboxGroupField
            legend={LABELS.status}
            name="archived"
            qsParam="archived"
            options={optionMetadata.statusOptions}
            selectedOptions={selectedFilters.statuses.options}
            data-test="status-filter"
            groupId="status-filter"
          />
        </CollectionFilters>
      </FilteredCollectionList>
    </DefaultLayout>
  )
}

export default connect(contactsState2props)(ContactsCollection)
