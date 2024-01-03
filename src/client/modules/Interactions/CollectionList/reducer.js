import {
  INTERACTIONS__LOADED,
  INTERACTIONS_SELECTED_ADVISERS,
  INTERACTIONS_SELECTED_COMPANIES,
  INTERACTIONS__METADATA_LOADED,
  INTERACTIONS_SELECTED_TEAMS,
} from '../../../actions'

const initialState = {
  results: [],
  metadata: {},
  selectedAdvisers: [],
  selectedTeams: [],
  selectedCompanies: [],
  isComplete: false,
}

export default (state = initialState, { type, result }) => {
  switch (type) {
    case INTERACTIONS__LOADED:
      return {
        ...state,
        ...result,
        isComplete: true,
      }
    case INTERACTIONS_SELECTED_ADVISERS:
      return {
        ...state,
        selectedAdvisers: result,
      }
    case INTERACTIONS_SELECTED_COMPANIES:
      return {
        ...state,
        selectedCompanies: result,
      }
    case INTERACTIONS__METADATA_LOADED:
      return {
        ...state,
        metadata: result,
      }
    case INTERACTIONS_SELECTED_TEAMS:
      return {
        ...state,
        selectedTeams: result,
      }
    default:
      return state
  }
}
