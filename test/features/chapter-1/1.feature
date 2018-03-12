Feature: Setting starting points and destinations

  Scenario: Starting point should be set to current location

    Given a commuter that enabled location tracking
     When the commuter wants to plan a journey
     Then the starting point should be set to current location

  Scenario: Commuters should be able to choose bus stops and locations

    Given a bus stop at Edison Street
      And a Edison Business Center building at Main Street
     When the commuter chooses a destination
     Then the commuter should be able to choose Edison Street
      But the commuter should be also able to choose Edison Business Center
