import {
  REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED,
  REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT,
  REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED,
  REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT,
} from '../../actions'

const initialState = {
  estimatedLandDateReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
  noRecentInteractionReminders: {
    results: [],
    count: 0,
    nextPending: false,
  },
}

export default (state = initialState, { type, result, payload }) => {
  switch (type) {
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED:
      return {
        ...state,
        estimatedLandDateReminders: result,
      }
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED:
      return {
        ...state,
        estimatedLandDateReminders: {
          ...state.estimatedLandDateReminders,
          results: state.estimatedLandDateReminders.results.map((item) => ({
            ...item,
            deleted: item.deleted || item.id === payload.id,
          })),
          count: state.estimatedLandDateReminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT:
      return {
        ...state,
        estimatedLandDateReminders: {
          ...state.estimatedLandDateReminders,
          results: [...state.estimatedLandDateReminders.results, ...result],
          nextPending: false,
        },
      }
    case REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED:
      return {
        ...state,
        noRecentInteractionReminders: result,
      }
    case REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED:
      return {
        ...state,
        noRecentInteractionReminders: {
          ...state.noRecentInteractionReminders,
          results: state.noRecentInteractionReminders.results.map((item) => ({
            ...item,
            deleted: item.deleted || item.id === payload.id,
          })),
          count: state.noRecentInteractionReminders.count - 1,
          nextPending: true,
        },
      }
    case REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT:
      return {
        ...state,
        noRecentInteractionReminders: {
          ...state.noRecentInteractionReminders,
          results: [...state.noRecentInteractionReminders.results, ...result],
          nextPending: false,
        },
      }
    default:
      return state
  }
}
