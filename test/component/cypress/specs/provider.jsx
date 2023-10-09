import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { combineReducers, applyMiddleware, legacy_createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'

import rootSaga from '../../../../src/client/root-saga'
import { reducers } from '../../../../src/client/reducers'
import { tasks as appTasks } from '../../../../src/client/tasks'

const sagaMiddleware = createSagaMiddleware()

const reducer = (state, action) =>
  combineReducers({
    ...reducers,
    activeFeatureGroups: () => [],
    modulePermissions: () => [],
    userPermissions: () => [],
  })(action.type === 'RESET' ? undefined : state, action)

export const store = legacy_createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)

export const dispatchResetAction = () => store.dispatch({ type: 'RESET' })

const runMiddlewareOnce = _.once((tasks) => sagaMiddleware.run(rootSaga(tasks)))

export default ({ children, tasks = appTasks, resetTasks = false }) => {
  // We only ever want to start the sagas once
  resetTasks ? sagaMiddleware.run(rootSaga(tasks)) : runMiddlewareOnce(tasks)

  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  )
}
