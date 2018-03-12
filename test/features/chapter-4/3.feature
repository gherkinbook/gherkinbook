Feature: Listing 5.3

  Scenario: Listing 5.3
  
    Given a <format> book in Simona's cart
     When she pays for it
     Then the book should be <shipped>
