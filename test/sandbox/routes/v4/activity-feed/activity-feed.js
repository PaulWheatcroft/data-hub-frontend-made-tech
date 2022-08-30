var { isEqual, startsWith, get } = require('lodash')

// External activities
var externalActivities = require('../../../fixtures/v4/activity-feed/external/external-activities.json')
var maxemailCampaignQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-query.json')
var maxemailCampaignActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-campaign-activities.json')
var maxemailEmailSentQuery = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-query.json')
var maxemailEmailSentActivities = require('../../../fixtures/v4/activity-feed/external/maxemail-email-sent-activities.json')

// Data Hub and external activities
var dataHubAndExternalActivities = require('../../../fixtures/v4/activity-feed/data-hub-and-external-activities.json')
var companyActivities = require('../../../fixtures/v4/activity-feed/company-activity-feed-activities.json')

// My activities
var myActivities = require('../../../fixtures/v4/activity-feed/my-activities.json')

// Data Hub activities
var dataHubActivities = require('../../../fixtures/v4/activity-feed/data-hub-activities.json')
var noActivity = require('../../../fixtures/v4/activity-feed/no-activity.json')
var dataHubEvents = require('../../../fixtures/v4/activity-feed/data-hub-events.json')

//Aventri events
var aventriEvents = require('../../../fixtures/v4/activity-feed/aventri-events.json')
var aventriEventsNoDetails = require('../../../fixtures/v4/activity-feed/aventri-events-no-details.json')
var aventriAttendees = require('../../../fixtures/v4/activity-feed/aventri-attendees.json')
////This order is correct when sorted by: First Name A-Z, Last name A-Z and Company name A-Z
var aventriAttendeesAToZOrder = require('../../../fixtures/v4/activity-feed/aventri-attendees-sort-a-z.json')

////This order is correct when sorted by: First Name Z-A, Last name Z-A and Company name Z-A
var aventriAttendeesZToAOrder = require('../../../fixtures/v4/activity-feed/aventri-attendees-sort-z-a.json')
//All Activitiy feed events
var allActivityFeedEvents = require('../../../fixtures/v4/activity-feed/all-activity-feed-events.json')

const DATA_HUB_ACTIVITY = [
  'dit:Interaction',
  'dit:ServiceDelivery',
  'dit:InvestmentProject',
  'dit:OMISOrder',
  'dit:CompanyReferral',
]

const EXTERNAL_ACTIVITY = ['dit:Accounts', 'dit:Company', 'dit:Export']

const DATA_HUB_AND_EXTERNAL_ACTIVITY = [
  ...DATA_HUB_ACTIVITY,
  ...EXTERNAL_ACTIVITY,
]

const ALL_ACTIVITY_STREAM_EVENTS = ['dit:aventri:Event', 'dit:dataHub:Event']

const ALL_ACTIVITIES_PER_PAGE = 10

const VENUS_LTD = 'dit:DataHubCompany:0f5216e0-849f-11e6-ae22-56b6b6499611'
const BEST_EVER_COMPANY =
  'dit:DataHubCompany:c79ba298-106e-4629-aa12-61ec6e2e47ce'

exports.activityFeed = function (req, res) {
  // Activities by contact
  var isContactActivityQuery = get(
    req.body,
    "query.bool.must[0].bool.should[1].bool.must[1].term['object.dit:emailAddress']"
  )

  if (isContactActivityQuery) {
    const from = get(req.body, 'from')

    const contactId = get(
      req.body,
      'query.bool.must[0].bool.should[0].bool.must[1].terms["object.attributedTo.id"][0]'
    )

    // if there is an error
    if (
      contactId === 'dit:DataHubContact:f3d19ea7-d4cf-43e0-8e97-755c57cae313'
    ) {
      return res.status(500).send('something went wrong')
    }

    //if page 2
    if (from == 10) {
      return res.json(dataHubActivities)
    }

    //if the sort by is newest
    if (req.body.sort[0].published.order === 'desc') {
      return res.json(dataHubAndExternalActivities)
    }
    //if the story by is oldest
    if (req.body.sort[0].published.order === 'asc') {
      return res.json(dataHubActivities)
    }
  }

  var allActivityStreamEventTypes = get(
    req.body,
    "query.bool.must[0].terms['object.type']"
  )

  var isAllActivityStreamEvents = isEqual(
    allActivityStreamEventTypes,
    ALL_ACTIVITY_STREAM_EVENTS
  )

  if (isAllActivityStreamEvents) {
    const { sort, from } = req.body

    //if page 2
    if (from == ALL_ACTIVITIES_PER_PAGE) {
      return res.json(allActivityFeedEvents)
    }

    // if the sort by is recently updated (modified_on:desc)
    if (sort['object.updated']?.order === 'desc') {
      return res.json(allActivityFeedEvents)
    }

    //if the story by is LEAST recently updated (modified_on:asc)
    if (sort['object.updated']?.order === 'asc') {
      return res.json(aventriEvents)
    }

    //if sorting by name
    if (sort['object.name.raw']) {
      return res.json(dataHubEvents)
    }
  }

  var isAventriEventQuery =
    get(req.body, "query.bool.must[0].term['object.type']") ===
    'dit:aventri:Event'

  if (isAventriEventQuery) {
    var aventriEventIdQuery = req.body.query.bool.must[1]
    var aventriId = aventriEventIdQuery.terms.id[0]

    //event not found
    if (aventriId === 'dit:aventri:Event:404:Create') {
      return res.json(noActivity)
    }

    //network error
    if (aventriId == 'dit:aventri:Event:500:Create') {
      return res.status(500).send('something went wrong')
    }

    //no optional details
    if (aventriId === 'dit:aventri:Event:6666:Create') {
      return res.json(aventriEventsNoDetails)
    }

    //happy path
    return res.json(aventriEvents)
  }

  var isAventriAttendeeQuery =
    get(req.body, "query.bool.must[0].term['object.type']") ===
    'dit:aventri:Attendee'

  if (isAventriAttendeeQuery) {
    var aventriId = get(
      req.body,
      "query.bool.must[1].term['object.attributedTo.id']"
    )
    // network error
    if (aventriId === 'dit:aventri:Event:500') {
      return res.status(500).send('something went wrong')
    }
    //sort by first name desc
    var firstNameOrder = req.body.sort['object.dit:firstName']?.order
    var lastNameOrder = req.body.sort['object.dit:lastName']?.order
    var companyNameOrder = req.body.sort['object.dit:companyName']?.order

    if (lastNameOrder === 'asc' || companyNameOrder === 'asc') {
      return res.json(aventriAttendeesAToZOrder)
    }

    if (
      firstNameOrder === 'desc' ||
      lastNameOrder === 'desc' ||
      companyNameOrder === 'desc'
    ) {
      return res.json(aventriAttendeesZToAOrder)
    }
    // happy path
    return res.json(aventriAttendees)
  }

  var isDataHubEventQuery =
    get(req.body, "query.bool.must[0].term['object.type']") ===
    'dit:dataHub:Event'
  if (isDataHubEventQuery) {
    return res.json(dataHubEvents)
  }

  // Data Hub activity
  var dataHubTypes = get(req.body, "query.bool.must[0].terms['object.type']")
  if (isEqual(dataHubTypes, DATA_HUB_ACTIVITY)) {
    var company = get(
      req.body,
      "query.bool.must[1].terms['object.attributedTo.id'][0]"
    )
    return res.json(company === VENUS_LTD ? noActivity : dataHubActivities)
  }

  // External activity
  var externalActivityTypes = get(
    req.body,
    "query.bool.filter.bool.should[0].bool.must[0].terms['object.type']"
  )
  if (isEqual(externalActivityTypes, EXTERNAL_ACTIVITY)) {
    return res.json(externalActivities)
  }

  // My activity
  var adviser = get(
    req.body,
    "query.bool.must[1].term['object.attributedTo.id']"
  )
  if (startsWith(adviser, 'dit:DataHubAdviser')) {
    return res.json(myActivities)
  }

  // Data Hub and external activity
  if (isEqual(externalActivityTypes, DATA_HUB_AND_EXTERNAL_ACTIVITY)) {
    var company = get(
      req.body,
      "query.bool.filter.bool.should[0].bool.must[1].terms['object.attributedTo.id'][0]"
    )
    return res.json(
      company === BEST_EVER_COMPANY
        ? companyActivities
        : dataHubAndExternalActivities
    )
  }

  // Maxemail campaigns
  if (isEqual(maxemailCampaignQuery, req.body)) {
    return res.json(maxemailCampaignActivities)
  }

  // Maxemail emails sent
  if (isEqual(maxemailEmailSentQuery, req.body)) {
    return res.json(maxemailEmailSentActivities)
  }

  return res.json(noActivity)
}
