Feature: Scheduling

  Because scheduling is a huge functionality, this
  specification file describes only the most important
  high-level scenario.
  You can find more detailed scenarios in the rest
  of the files inside the "meetings" folder in the
  specification suite.

  Scenario: Creating a new meeting successfully

    Given Mike, a member of our team
      And that it isn't 2 p.m. yet
     When Mike chooses 2 p.m. as a start time for his meeting
     Then he should be able to save his meeting

  Scenario: Failing at creating a new meeting

    Given Mike, a member of our team
      And that it's already 3 p.m.
     When Mike chooses 2 p.m. as a start time for his meeting
     Then he shouldn't be able to save his meeting
