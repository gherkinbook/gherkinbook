Feature: New businesses

  Scenario Outline: Businesses should provide required data

    [...]

  Scenario Outline: Businesses should be able to set their hours

    Given a restaurant <business> on <location>
     When it schedules its hours to be <times> every day
     Then the hours should appear on the map at <location>

    Examples: Restaurants
      | business   | location                  | times     |
      | Deep Lemon | 6750 Street South, Reno   | 7 AM-8 PM |

    Examples: Bistros
      | business   | location                  | times     |
      | Le Chef    | 3318 Summit Avenue, Tampa | 9 AM-9 PM |

    Examples: Pubs
      | business   | location                  | times     |
      | Anchor     | 77 Chapel Road, Chicago   | 3 PM-3 AM |
