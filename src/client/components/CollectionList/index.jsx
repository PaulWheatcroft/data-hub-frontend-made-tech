/* eslint-disable react/no-array-index-key */
// this is because there isn't necessarily a unique id to use as the key

import React from 'react'
import PropTypes from 'prop-types'

import { GridRow, GridCol } from 'govuk-react'
import Task from '../../../client/components/Task'

import {
  CollectionHeader,
  CollectionSort,
  CollectionItem,
} from '../../components'

import RoutedPagination from '../RoutedPagination'

const CollectionList = ({
  results = [],
  itemsPerPage = 10,
  sortOptions = null,
  taskProps,
  count = 0,
  isComplete,
  children,
  collectionName,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage)
  return (
    <GridRow>
      {children}
      <GridCol setWidth={children ? `two-thirds` : `full`}>
        <article>
          {collectionName && (
            <CollectionHeader
              totalItems={count}
              collectionName={collectionName}
            />
          )}
          {sortOptions && (
            <CollectionSort sortOptions={sortOptions} totalPages={count} />
          )}

          <Task.Status {...taskProps}>
            {() =>
              isComplete && (
                <>
                  {results.map((item, i) => (
                    <CollectionItem {...item} key={i} />
                  ))}

                  <RoutedPagination
                    qsParamName="page"
                    totalPages={totalPages}
                  />
                </>
              )
            }
          </Task.Status>
        </article>
      </GridCol>
    </GridRow>
  )
}

CollectionList.propTypes = {
  taskProps: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
    progressMessage: PropTypes.string,
    startOnRender: PropTypes.shape({
      payload: PropTypes.shape({
        page: PropTypes.string,
        filters: PropTypes.object,
        search: PropTypes.string,
      }).isRequired,
      onSuccessDispatch: PropTypes.string,
    }).isRequired,
  }).isRequired,
  isComplete: PropTypes.bool,
  children: PropTypes.node,
  collectionName: PropTypes.string,
  router: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
      query: PropTypes.object.isRequired,
    }),
  }),
  maxItemsToDownload: PropTypes.number,
}

export default CollectionList
