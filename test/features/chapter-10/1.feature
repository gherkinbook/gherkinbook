Feature: Listing 10.1

  Scenario: Listing 10.1

    Given a 2GB limit on free cloud drive accounts
      And 2 GB of files on Simona's free cloud drive account
     When she upgrades to the premium plan
     Then her credit card should be charged $5
      And her storage should be upgraded to a 40 GB limit
