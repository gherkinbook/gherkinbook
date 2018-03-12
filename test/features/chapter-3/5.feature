Feature: Listing 3.5

  Scenario: Improving readability score

    Given Vladimir's low readability score
     When he goes into the Edit Mode
      And he simplifies the text
     Then his readability score should improve
