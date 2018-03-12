@feature-level-tag
Feature: Some terse yet descriptive text of what is desired

  Textual description of the business value of this feature
  Business rules that govern the scope of the feature
  Any additional information that will make the feature easier to understand

  Background:
    Given I am not logged in
    And some other pre condition is set

  @scenario-tag, @another-tag
  Scenario: Some determinable business situation
    Given some precondition
    And some other precondition
    When some action by the actor
    And some other action
    And yet another action
    Then some testable outcome is achieved
    And something else we can check happens too

  Scenario Outline: eating

  For more information on availability, please look at the
  invite confirmation scenarios later in the specification.
  In short, an unavailable person who already confirmed RSVP
  can be invited to another event at the same time, but will
  be able to attend only one of them.

    Given there are <start> cucumbers
    When I eat <eat> cucumbers
    Then I should have <left> cucumbers

    Examples:
      | start | eat | left |
      |  12   |  5  |  7   |
      |  20   |  5  |  15  |

  Scenario Outline: Screening tenant leads based on credit score

    TENANTS PIPELINE is a list of verified tenant
    leads a landlord can choose from.

    Credit score is calculated by an external auditor
    through their API and has a range of 300-850.

    Given a tenant lead:
      | name           | credit used | total debt |
      | Simona Jenkins | <used>      | <debt>     |
      And that the lead waits in the queue to the tenants pipeline
     When the tenant lead has a <score>
     Then we should <result> the lead

    Examples:
      | used | debt     | score               | result |
      | 40%  | $202,704 | credit score of 499 | reject |
      | 41%  | $202,704 | credit score of 500 | accept |

  Scenario: Detect sentences that are too long

    Given text with a sentence that is too long:
      """
      As he crossed toward the pharmacy at the corner he involuntarily turned
      his head because of a burst of light that had ricocheted from his
      temple, and saw, with that quick smile with which we greet a rainbow or
      a rose, a blindingly white parallelogram of sky being unloaded from the
      van—a dresser with mirror across which, as across a cinema screen,
      passed a flawlessly clear reflection of boughs sliding and swaying not
      arboreally, but with a human vacillation, produced by the nature of
      those who were carrying this sky, these boughs, this gliding façade.
      """
     When the content is analyzed
     Then the sentence that is too long should be detected

   Scenario Outline: Shipping

     Given an <item> in Simona's cart
      When she pays for it
      Then the book should be <shipped> by <provider>

     Examples: Ship by sending to a mobile device
       | item       | shipped               | provider |
       | PDF e-book | sent to mobile device | Apple    |
       | PDF e-book | sent to mobile device | Google   |
       | PDF e-book | sent to mobile device | Amazon   |

     Examples: Ship by sending a download link
       | item      | shipped         | provider         |
       | Audiobook | sent over email | in-house service |

     Examples: Ship by a postal service
       | item           | shipped            | provider         |
       | Hardcover book | shipped physically | postal service   |
       | Paperback book | shipped physically | postal service   |
       | Audio CD       | shipped physically | postal service   |

     Examples: Ship by courier
       There are five different types of coupons available.
       | item      | shipped            | provider         |
       | E-reader  | shipped physically | courier delivery |
       | Tablet    | shipped physically | courier delivery |
       | Headphone | shipped physically | courier delivery |
