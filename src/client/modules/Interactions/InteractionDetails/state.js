export const ID = 'interactionDetails'

export const TASK_ARCHIVE_INTERACTION = 'TASK_ARCHIVE_INTERACTION'

export const state2props = ({ values, ...state }) => ({
  ...state[ID],
  values,
})
