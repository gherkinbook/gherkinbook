Feature: Listing 11.1

  Scenario: Team leads and HR should be able to cancel events

    Given an event created by Mike for his team:
      | name    | date       | time  |
      | Bowling | 10-03-2017 | 10 AM |
      And Simona's confirmed attendance
     When Mike cancels the event
     Then Simona should receive a cancellation notification
