import { apiProxyAxios } from '../../../components/Task/utils'

import { settings } from '../constants'
import { formatDays, transformReminderDaysToForm } from '../transformers'

// ********************** Summary ***************************

const defaultDaysSort = (a, b) => a - b
const reversedDaysSort = (a, b) => b - a

const transformSubscriptionSummary = ({ data }) => ({
  estimatedLandDate: transformDaysAndEmailReminders(
    data.estimated_land_date,
    'days before the estimated land date',
    reversedDaysSort
  ),
  noRecentInteraction: transformDaysAndEmailReminders(
    data.no_recent_investment_interaction,
    'days after the last interaction'
  ),
  exportNoRecentInteractions: transformDaysAndEmailReminders(
    data.no_recent_export_interaction,
    'days after the last interaction'
  ),
  exportNewInteractions: transformDaysAndEmailReminders(
    data.new_export_interaction,
    'days after a new interaction was posted'
  ),
  upcomingTaskReminder: transformDaysAndEmailReminders(
    data.upcoming_task_reminder,
    'days before the task due date'
  ),
})

const transformDaysAndEmailReminders = (
  data,
  suffixLabel,
  daysSort = defaultDaysSort
) => ({
  formattedReminderDays: transformFormattedReminderDays(
    data,
    suffixLabel,
    daysSort
  ),
  emailRemindersOnOff: transformEmailReminders(data),
})

const transformFormattedReminderDays = (
  data,
  suffixLabel,
  sort = defaultDaysSort
) => formatDays(data.reminder_days.sort(sort), suffixLabel)

const transformEmailReminders = (data) =>
  data.email_reminders_enabled ? settings.ON : settings.OFF

export const getSubscriptionSummary = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/summary')
    .then(transformSubscriptionSummary)

// ********************** Investment subscriptions ***************************

export const getEldSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/estimated-land-date')
    .then(({ data }) => ({
      estimatedLandDate: {
        reminderDays: data.reminder_days,
        emailRemindersEnabled: data.email_reminders_enabled,
      },
    }))

export const saveEldSubscriptions = (payload) =>
  apiProxyAxios.patch('/v4/reminder/subscription/estimated-land-date', payload)

export const getNriSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/no-recent-investment-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNriSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/no-recent-investment-interaction',
    payload
  )

// **********************  Export subscriptions ***************************

export const getNriExportSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/no-recent-export-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNriExportSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/no-recent-export-interaction',
    payload
  )

export const getNIExportSubscriptions = () =>
  apiProxyAxios
    .get('/v4/reminder/subscription/new-export-interaction')
    .then(({ data }) => ({
      ...transformReminderDaysToForm(
        [...data.reminder_days].sort((a, b) => a - b)
      ),
      reminder_days: data.reminder_days,
      email_reminders_enabled: data.email_reminders_enabled,
    }))

export const saveNIExportSubscriptions = (payload) =>
  apiProxyAxios.patch(
    '/v4/reminder/subscription/new-export-interaction',
    payload
  )
