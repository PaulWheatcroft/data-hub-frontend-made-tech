import React from 'react'
import { useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import qs from 'qs'

import {
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED,
  REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT,
} from '../../actions'

import {
  ID,
  TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
  TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
  TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER,
} from './state'

import { sortOptions, maxItemsToPaginate, itemsPerPage } from './constants'

import RemindersLayout from './RemindersLayout'
import CollectionHeader from './CollectionHeader'
import Effect from '../../components/Effect'
import Task from '../../components/Task'
import ExportsCollectionList from './ExportsCollectionList'
import { CollectionSort, RoutedPagination } from '../../components'

const ExportsNoRecentInteractionReminders = ({
  exportsNoRecentInteractionReminders,
}) => {
  const { results, count, nextPending } = exportsNoRecentInteractionReminders
  const location = useLocation()
  const qsParams = qs.parse(location.search.slice(1))
  const page = parseInt(qsParams.page, 10) || 1
  const subject = 'companies with no recent interactions'
  const title = `Reminders for ${subject}`
  const totalPages = Math.ceil(
    Math.min(count, maxItemsToPaginate) / itemsPerPage
  )

  return (
    <RemindersLayout pageTitle={title} subject={subject}>
      <CollectionHeader
        totalItems={count}
        pageOrigin="exports_no_recent_interaction"
      />
      {results.length === 0 ? (
        <p data-test="investments-no-reminders">You have no reminders.</p>
      ) : (
        <CollectionSort sortOptions={sortOptions} totalPages={totalPages} />
      )}
      <Task.Status
        name={TASK_GET_EXPORTS_NO_RECENT_INTERACTION_REMINDERS}
        id={ID}
        startOnRender={{
          payload: { page, sortby: qsParams.sortby },
          onSuccessDispatch:
            REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED,
        }}
      >
        {() => (
          <Task>
            {(getTask) => {
              const deleteTask = getTask(
                TASK_DELETE_EXPORTS_NO_RECENT_INTERACTION_REMINDER,
                ID
              )
              const getNextTask = getTask(
                TASK_GET_NEXT_EXPORTS_NO_RECENT_INTERACTION_REMINDERS,
                ID
              )
              return (
                <>
                  <Effect
                    dependencyList={[nextPending]}
                    effect={() =>
                      nextPending &&
                      getNextTask.start({
                        payload: {
                          page,
                          sortby: qsParams.sortby,
                        },
                        onSuccessDispatch:
                          REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT,
                      })
                    }
                  />
                  <ExportsCollectionList
                    results={results}
                    disableDelete={deleteTask.status || nextPending}
                    onDeleteReminder={(reminderId) => {
                      deleteTask.start({
                        payload: { id: reminderId },
                        onSuccessDispatch:
                          REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED,
                      })
                    }}
                  />
                  <RoutedPagination initialPage={page} items={count || 0} />
                </>
              )
            }}
          </Task>
        )}
      </Task.Status>
    </RemindersLayout>
  )
}

export const state2props = (state) => state[ID]

export default connect(state2props)(ExportsNoRecentInteractionReminders)
