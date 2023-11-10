/**
 * This module is a registry of all Redux action types used within the app.
 * Redux actions are shared by all components/reducers so their names must not
 * collide. Having them defined as constants in a single module is a simple
 * measure to prevent such hard to debug cases.
 *
 * The name and value of the constants must be the same.
 * The name should be the name of the component the action relates to and a verb
 * describing what it does, concatenated by double underscore.
 */

export const INTERACTIONS__LOADED = 'INTERACTIONS__LOADED'
export const INTERACTIONS__METADATA_LOADED = 'INTERACTIONS__METADATA_LOADED'
export const INTERACTIONS_SELECTED_ADVISERS = 'INTERACTIONS_SELECTED_ADVISERS'
export const INTERACTIONS_SELECTED_COMPANIES = 'INTERACTIONS_SELECTED_COMPANIES'
export const INTERACTIONS_SELECTED_TEAMS = 'INTERACTIONS_SELECTED_TEAMS'

export const COMPANIES__LOADED = 'COMPANIES__LOADED'
export const COMPANIES__METADATA_LOADED = 'COMPANIES__METADATA_LOADED'
export const COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER =
  'COMPANIES__SELECTED_LEAD_ITA_OR_GLOBAL_ACCOUNT_MANAGER'

export const COMPANY_LISTS__LISTS_LOADED = 'COMPANY_LISTS__LISTS_LOADED'
export const COMPANY_LISTS__SELECT = 'COMPANY_LISTS__SELECT'
export const COMPANY_LISTS__COMPANIES_LOADED = 'COMPANY_LISTS__COMPANIES_LOADED'
export const COMPANY_LISTS__FILTER = 'COMPANY_LISTS__FILTER'
export const COMPANY_LISTS__ORDER = 'COMPANY_LISTS__ORDER'

export const CONTACTS__LOADED = 'CONTACTS__LOADED'
export const CONTACTS__METADATA_LOADED = 'CONTACTS__METADATA_LOADED'
export const CONTACTS__ACTIVITIES_LOADED = 'CONTACTS__ACTIVITIES_LOADED'

export const ORDERS__LOADED = 'ORDERS__LOADED'
export const ORDERS__METADATA_LOADED = 'ORDERS__METADATA_LOADED'

export const EVENTS__LOADED = 'EVENTS__LOADED'
export const EVENTS__METADATA_LOADED = 'EVENTS__METADATA_LOADED'
export const EVENTS__ALL_ACTIVITY_FEED_EVENTS_LOADED =
  'EVENTS__ALL_ACTIVITY_FEED_EVENTS_LOADED'
export const EVENTS__SELECTED_ORGANISER = 'EVENTS__SELECTED_ORGANISER'
export const EVENTS__DETAILS_LOADED = 'EVENTS__DETAILS_LOADED'

export const EVENTS__AVENTRI_DETAILS_LOADED = 'EVENTS__AVENTRI_DETAILS_LOADED'
export const EVENTS__AVENTRI_REGISTRATION_STATUS_ATTENDEES_LOADED =
  'EVENTS__AVENTRI_REGISTRATION_STATUS_ATTENDEES_LOADED'
export const EVENTS__AVENTRI_REGISTRATION_STATUS_LOADED =
  'EVENTS__AVENTRI_REGISTRATION_STATUS_LOADED'

export const EVENTS__SEARCH_ATTENDEE_LIST_LOADED =
  'EVENTS__SEARCH_ATTENDEE_LIST_LOADED'
export const EVENTS__ATTENDEE_METADATA_LOADED =
  'EVENTS__ATTENDEE_METADATA_LOADED'

export const INTERACTION__ESS_DETAILS_LOADED = 'INTERACTION__ESS_DETAILS_LOADED'

export const REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED =
  'REMINDERS__ESTIMATED_LAND_DATE_REMINDERS_LOADED'
export const REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED =
  'REMINDERS__ESTIMATED_LAND_DATE_REMINDER_DELETED'
export const REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT =
  'REMINDERS__ESTIMATED_LAND_DATE_REMINDER_GOT_NEXT'
export const REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED =
  'REMINDERS__NO_RECENT_INTERACTION_REMINDERS_LOADED'
export const REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED =
  'REMINDERS__NO_RECENT_INTERACTION_REMINDER_DELETED'
export const REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT =
  'REMINDERS__NO_RECENT_INTERACTION_REMINDER_GOT_NEXT'
export const REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED =
  'REMINDERS__OUTSTANDING_PROPOSITIONS_LOADED'
export const REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED =
  'REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_LOADED'
export const REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED =
  'REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_DELETED'
export const REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT =
  'REMINDERS__EXPORTS_NO_RECENT_INTERACTION_REMINDERS_GOT_NEXT'
export const REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED =
  'REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_LOADED'
export const REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED =
  'REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_DELETED'
export const REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT =
  'REMINDERS__EXPORTS_NEW_INTERACTION_REMINDERS_GOT_NEXT'
export const REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED =
  'REMINDERS__DUE_DATE_APPROACHING_REMINDERS_LOADED'
export const REMINDERS__DUE_DATE_APPROACHING_REMINDERS_GOT_NEXT =
  'REMINDERS__DUE_DATE_APPROACHING_REMINDERS_GOT_NEXT'
export const REMINDERS__DUE_DATE_APPROACHING_REMINDERS_DELETED =
  'REMINDERS__DUE_DATE_APPROACHING_REMINDERS_DELETED'
export const REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED =
  'REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_LOADED'
export const REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT =
  'REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_GOT_NEXT'
export const REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED =
  'REMINDERS__TASK_ASSIGNED_TO_ME_FROM_OTHERS_REMINDERS_DELETED'

export const REFERRAL_DETAILS = 'REFERRAL_DETAILS'

export const TASK__START = 'TASK__START'
export const TASK__PROGRESS = 'TASK__PROGRESS'
export const TASK__CANCEL = 'TASK__CANCEL'
export const TASK__ERROR = 'TASK__ERROR'
export const TASK__DISMISS_ERROR = 'TASK__DISMISS_ERROR'
export const TASK__CLEAR = 'TASK__CLEAR'

export const EXPORTS_HISTORY__LOADED = 'EXPORTS_HISTORY__LOADED'
export const EXPORTS_HISTORY__SELECT_PAGE = 'EXPORTS_HISTORY__SELECT_PAGE'

export const TAB_NAV__SELECT = 'TAB_NAV__SELECT'
export const TAB_NAV__FOCUS = 'TAB_NAV__FOCUS'

export const SEND_REFERRAL_FORM__SUBMIT = 'SEND_REFERRAL_FORM__SUBMIT'

export const EDIT_ONE_LIST_DETAILS__SUBMIT = 'EDIT_ONE_LIST_DETAILS__SUBMIT'

export const REFERRAL_LIST__LOADED = 'REFERRAL_LIST__LOADED'
export const REFERRAL_LIST__FILTER_CHANGE = 'REFERRAL_LIST__FILTER_CHANGE'

export const EXPORT_WINS__LOADED = 'EXPORT_WINS__LOADED'
export const EXPORT_WINS__SELECT_PAGE = 'EXPORT_WINS__SELECT_PAGE'

export const EXPORT_COUNTRIES_EDIT__SAVE = 'EXPORT_COUNTRIES_EDIT__SAVE'

export const FORM__LOADED = 'FORM__LOADED'
export const FORM__FIELD_SET_VALUE = 'FORM__FIELD_SET_VALUE'
export const FORM__FIELD_TOUCHED = 'FORM__FIELD_TOUCHED'
export const FORM__FIELD_REGISTER = 'FORM__FIELD_REGISTER'
export const FORM__FIELD_DEREGISTER = 'FORM__FIELD_DEREGISTER'
export const FORM__STEP_REGISTER = 'FORM__STEP_REGISTER'
export const FORM__STEP_DEREGISTER = 'FORM__STEP_DEREGISTER'
export const FORM__FIELDS__RESET = 'FORM__FIELDS__RESET'
export const FORM__FORWARD = 'FORM__FORWARD'
export const FORM__BACK = 'FORM__BACK'
export const FORM__GO_TO_STEP = 'FORM__GO_TO_STEP'
export const FORM__VALIDATE = 'FORM__VALIDATE'
export const FORM__RESOLVED = 'FORM__RESOLVED'
export const FORM__ERRORED = 'FORM__ERRORED'

export const ADD_COMPANY__REGION_LOADED = 'ADD_COMPANY__REGION_LOADED'

export const PIPELINE__CHECKED_IF_ON_PIPELINE =
  'PIPELINE__CHECKED_IF_ON_PIPELINE'
export const PIPELINE__LIST_LOADED = 'PIPELINE__LIST_LOADED'
export const PIPELINE__GET_ITEM = 'PIPELINE__GET_ITEM'
export const PIPELINE__LIST_FILTER_SORT_CHANGED =
  'PIPELINE__LIST_FILTER_SORT_CHANGED'

export const DROP_DOWN_MENU_TOGGLE = 'DROP_DOWN_MENU_TOGGLE'
export const DROP_DOWN_MENU_OPEN = 'DROP_DOWN_MENU_OPEN'
export const DROP_DOWN_MENU_CLOSED = 'DROP_DOWN_MENU_CLOSED'
export const DROP_DOWN_MENU_UPDATE_INDEX = 'DROP_DOWN_MENU_UPDATE_INDEX'

export const ANALYTICS__PUSH = 'ANALYTICS__PUSH'
export const MANAGE_ADVISER__UPDATE_STAGE = 'MANAGE_ADVISER__UPDATE_STAGE'

export const DNB__CHECK_PENDING_REQUEST = 'DNB__CHECK_PENDING_REQUEST'

export const TOGGLE_SECTION__TOGGLE = 'TOGGLE_SECTION__TOGGLE'

export const INVESTMENTS__PROJECTS_LOADED = 'INVESTMENTS__PROJECTS_LOADED'
export const INVESTMENTS__PROJECTS_SELECTED_ADVISERS =
  'INVESTMENTS__PROJECTS_SELECTED_ADVISERS'

export const INVESTMENTS__PROFILES_LOADED = 'INVESTMENTS__PROFILES_LOADED'
export const INVESTMENTS__SET_PROJECTS_METADATA =
  'INVESTMENTS__SET_PROJECTS_METADATA'

export const INVESTMENT__SEARCH_COMPANY_LIST_LOADED =
  'INVESTMENT__SEARCH_COMPANY_LIST_LOADED'
export const INVESTMENT__COMPANY_INVESTMENT_COUNT =
  'INVESTMENT__COMPANY_INVESTMENT_COUNT'
export const INVESTMENT__COMPANY_SEARCH_TERM = 'INVESTMENT__COMPANY_SEARCH_TERM'

export const INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED =
  'INVESTMENTS_PROFILES__FILTER_OPTIONS_LOADED'

export const INVESTMENT_OPPORTUNITY_DETAILS__LOADED =
  'INVESTMENT_OPPORTUNITY_DETAILS__LOADED'
export const INVESTMENTS__OPPORTUNITIES_LOADED =
  'INVESTMENTS__OPPORTUNITIES_LOADED'
export const INVESTMENTS__OPPORTUNITIES_SELECT_PAGE =
  'INVESTMENTS__OPPORTUNITIES_SELECT_PAGE'
export const INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED =
  'INVESTMENT_OPPORTUNITY__REQUIREMENTS_METADATA_LOADED'
export const INVESTMENT_OPPORTUNITY__EDIT_DETAILS =
  'INVESTMENT_OPPORTUNITY__EDIT_DETAILS'
export const INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS =
  'INVESTMENT_OPPORTUNITY__EDIT_REQUIREMENTS'
export const INVESTMENT_OPPORTUNITY__CANCEL_EDIT =
  'INVESTMENT_OPPORTUNITY__CANCEL_EDIT'
export const INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE =
  'INVESTMENT_OPPORTUNITY__REQUIREMENTS_CHANGE'
export const INVESTMENT_OPPORTUNITY__UPDATED = 'INVESTMENT_OPPORTUNITY__UPDATED'

export const MY_INVESTMENTS__LIST_LOADED = 'MY_INVESTMENTS__LIST_LOADED'
export const MY_INVESTMENTS__CHECK_COMPLETE = 'MY_INVESTMENTS__CHECK_COMPLETE'
export const MY_INVESTMENTS__PAGINATION_CLICK =
  'MY_INVESTMENTS__PAGINATION_CLICK'
export const MY_INVESTMENTS__STAGE_CHANGE = 'MY_INVESTMENTS__STAGE_CHANGE'
export const MY_INVESTMENTS__STATUS_CHANGE = 'MY_INVESTMENTS__STATUS_CHANGE'
export const MY_INVESTMENTS__LAND_DATE_CHANGE =
  'MY_INVESTMENTS__LAND_DATE_CHANGE'
export const MY_INVESTMENTS__SORT_CHANGE = 'MY_INVESTMENTS__SORT_CHANGE'
export const MY_INVESTMENTS__SHOW_DETAILS_CHANGE =
  'MY_INVESTMENTS__SHOW_DETAILS_CHANGE'
export const MY_INVESTMENTS__SAVE_TO_SESSION = 'MY_INVESTMENTS__SAVE_TO_SESSION'
export const MY_INVESTMENTS__GET_FROM_SESSION =
  'MY_INVESTMENTS__GET_FROM_SESSION'
export const MY_INVESTMENTS__ADD_TO_STATE = 'MY_INVESTMENTS__ADD_TO_STATE'

export const INVESTMENT_SUMMARY_DATA_RANGES__LOADED =
  'INVESTMENT_SUMMARY_DATA_RANGES__LOADED'

export const OUTSTANDING_PROPOSITIONS__LOADED =
  'OUTSTANDING_PROPOSITIONS__LOADED'
export const REMINDER_SUMMARY__LOADED = 'REMINDER_SUMMARY__LOADED'
export const NOTIFICATION_ALERT_COUNT__LOADED =
  'NOTIFICATION_ALERT_COUNT__LOADED'

export const ROUTED_INPUT__CHANGE = 'ROUTED_INPUT__CHANGE'
export const ROUTED_INPUT__SELECT = 'ROUTED_INPUT__SELECT'
export const ROUTED_INPUT__RESET = 'ROUTED_INPUT__RESET'

export const HARD_REDIRECT = 'HARD_REDIRECT'

export const CONTACT_FORM__SUBMIT = 'CONTACT_FORM__SUBMIT'

export const ARCHIVE_COMPANY = 'ARCHIVE_COMPANY'

export const TASK_REACT_SELECT__OPEN_MENU = 'TASK_REACT_SELECT__OPEN_MENU'
export const TASK_REACT_SELECT__SUCCESS = 'TASK_REACT_SELECT__SUCCESS'
export const TASK_REACT_SELECT__CHANGE = 'TASK_REACT_SELECT__CHANGE'
export const TASK_REACT_SELECT__INPUT_CHANGE = 'TASK_REACT_SELECT__INPUT_CHANGE'

export const TYPEAHEAD__BLUR = 'TYPEAHEAD__BLUR'
export const TYPEAHEAD__SET_ACTIVE_OPTION = 'TYPEAHEAD__SET_ACTIVE_OPTION'
export const TYPEAHEAD__INPUT = 'TYPEAHEAD__INPUT'
export const TYPEAHEAD__INITIALISE = 'TYPEAHEAD__INITIALISE'
export const TYPEAHEAD__MENU_CLOSE = 'TYPEAHEAD__MENU_CLOSE'
export const TYPEAHEAD__MENU_OPEN = 'TYPEAHEAD__MENU_OPEN'
export const TYPEAHEAD__OPTION_MOUSE_DOWN = 'TYPEAHEAD__OPTION_MOUSE_DOWN'
export const TYPEAHEAD__OPTIONS_LOADED = 'TYPEAHEAD__OPTIONS_LOADED'
export const TYPEAHEAD__OPTIONS_CLEAR = 'TYPEAHEAD__OPTIONS_CLEAR'
export const TYPEAHEAD__OPTION_TOGGLE = 'TYPEAHEAD__OPTION_TOGGLE'
export const TYPEAHEAD__OPTION_REMOVE = 'TYPEAHEAD__OPTION_REMOVE'

export const FLASH_MESSAGE__WRITE_TO_SESSION = 'FLASH_MESSAGE__WRITE_TO_SESSION'
export const FLASH_MESSAGE__ADD_TO_STATE = 'FLASH_MESSAGE__ADD_TO_STATE'
export const FLASH_MESSAGE__GET_FROM_SESSION = 'FLASH_MESSAGE__GET_FROM_SESSION'
export const FLASH_MESSAGE__CLEAR_FROM_STATE = 'FLASH_MESSAGE__CLEAR_FROM_STATE'

export const FIELD_ADD_ANOTHER__INITIALISE = 'FIELD_ADD_ANOTHER__INITIALISE'
export const FIELD_ADD_ANOTHER__ADD = 'FIELD_ADD_ANOTHER__ADD'
export const FIELD_ADD_ANOTHER__REMOVE = 'FIELD_ADD_ANOTHER__REMOVE'

export const DATA_HUB_FEED__FETCHED = 'DATA_HUB_FEED__FETCHED'

export const LATEST_ANNOUNCEMENT__WRITE_TO_LOCALSTORAGE =
  'LATEST_ANNOUNCEMENT__WRITE_TO_LOCALSTORAGE'
export const LATEST_ANNOUNCEMENT__READ_FROM_LOCALSTORAGE =
  'LATEST_ANNOUNCEMENT__READ_FROM_LOCALSTORAGE'
export const LATEST_ANNOUNCEMENT__UPDATE_STATE =
  'LATEST_ANNOUNCEMENT__UPDATE_STATE'

export const COMPANY_LOADED = 'COMPANY_LOADED'

export const COMPANY_ACTIVITIES__LOADED = 'COMPANY_ACTIVITIES__LOADED'
export const COMPANY_ACTIVITIES__METADATA_LOADED =
  'COMPANY_ACTIVITIES__METADATA_LOADED'
export const COMPANY_ACTIVITIES_SELECTED_ADVISERS =
  'COMPANY_ACTIVITIES_SELECTED_ADVISERS'
export const COMPANY_ACTIVITIES_SELECTED_COMPANIES =
  'COMPANY_ACTIVITIES_SELECTED_COMPANIES'
export const COMPANY_ACTIVITIES_SELECTED_TEAMS =
  'COMPANY_ACTIVITIES_SELECTED_TEAMS'

export const EXPORT_LOADED = 'EXPORT_LOADED'

export const OVERVIEW__COMPANY_INVESTMENT_WON_COUNT =
  'OVERVIEW__COMPANY_INVESTMENT_WON_COUNT'

export const OVERVIEW__EXPORT_WINS_SUMMARY = 'OVERVIEW__EXPORT_WINS_SUMMARY'
export const EXPORT__PIPELINE_LIST_LOADED = 'EXPORT__PIPELINE_LIST_LOADED'
export const EXPORT__PIPELINE_METADATA_LOADED =
  'EXPORT__PIPELINE_METADATA_LOADED'

export const COMPANY_LISTS__COMPANY_IN_LOADED =
  'COMPANY_LISTS__COMPANY_IN_LOADED'

export const DNB_FAMILY_TREE_LOADED = 'DNB_FAMILY_TREE_LOADED'

export const OBJECTIVE_LOADED = 'OBJECTIVE_LOADED'

export const ONE_LIST_DETAILS_LOADED = 'ONE_LIST_DETAILS_LOADED'

export const TASK_DETAILS_LOADED = 'TASK_DETAILS_LOADED'

export const INVESTMENT__PROJECT_LOADED = 'INVESTMENT__PROJECT_LOADED'

export const EXPORT_WINS__CONFIRMED_LOADED = 'EXPORT_WINS__CONFIRMED_LOADED'
export const EXPORT_WINS__UNCONFIRMED_LOADED = 'EXPORT_WINS__UNCONFIRMED_LOADED'
export const EXPORT_WINS__DETAILS_LOADED = 'EXPORT_WINS__DETAILS_LOADED'
