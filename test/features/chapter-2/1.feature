Feature: Teams

	Scenario: Enforcing access rules

	For more information on availability, please look at the
	invite confirmation scenarios later in the specification.
	In short, an unavailable person who already confirmed RSVP
	can be invited to another event at the same time, but will
	be able to attend only one of them.

	Given Mike, Kate, and John were assigned to the same team
	  And Ada was assigned to another team
	 When Kate and Mike schedule a 1 hour long meeting at 4 p.m.
	 Then John should see that Kate and Mike will be unavailable
	  But Ada shouldn't be able to see Kate and Mike's meeting
