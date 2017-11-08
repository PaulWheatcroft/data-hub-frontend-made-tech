@interaction-save
Feature: Save a new interaction in Data hub
  As an Data Hub user
  I would like to add an interaction record to data hub
  So that I can enable the collection of key interaction data

  @interaction-save--companies-interaction-submit
  Scenario: Companies interaction is saved

    Given a company is created
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting interaction
    And adding an interaction
    Then I see the success message

  @interaction-save--companies-service-delivery-submit
  Scenario: Companies service delivery is saved

    Given a company is created
    And a company contact is created for interactions
    When navigating to the create company interactions and services step 1 page
    And selecting service delivery
    And adding a service delivery
    Then I see the success message
