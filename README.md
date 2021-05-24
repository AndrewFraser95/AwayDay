# AwayDay
Statistics for Crime Rates, at Premier League Stadiums, since the league began.

# Welcome
Welcome to "Away Day - Safety".
An angular app trying to answer all parameters of the following requirement:
"...A list of recorded crimes [2] for Premier League Football Stadiums [1] sorted by year and month.[3]"

# Process

## (Step 1)
I have very generously been provided the League Code for the English Premier League (EPL).
Of which I will use to query the 'Football Stadium Data' competitions API endpoint.

#### Thought: Some teams will have entered and then left the league.

At this point I'm assuming the use/design of the requirements which is never ideal. 
And normally something I would talk to a client to confirm.
But I think it's fairly safe to say that getting crime rates for stadiums in the EPL 
should only be collated when said team is still in the EPL, and recieving as much foot-traffic.

This makes it easier to structure queries in a year-first format.
E.g. For a given year, there is a given arrangement of teams, of which had crime in said year.

## (Step 2)
At this point we need to link it to crime data.
Of which requires a location (in the format latitude longitude), and a year.

This step has been made slightly easier given our year-first approach.
Because a user has already chosen a year and team.
So we have the postcode of the stadium and the year at this point.
So next we query the postcode API for the latitude and longitude and then query the crime API with all 3 values.

## (Step 3)
We already are presenting the user with crime data filtered by the season (year), so that all teams and their postcodes
are relevant for the year in question.
At which point we are just doing a fairly tin-plate alpha-numeric sort (If the month is in a 'mm' format)

# Running
To run this application
1. cd away-day
2. ng serve --open

# Instructions
1. Please choose a year from the dropdown e.g. 2019
2. Then select 1 team from the first table that you would like statistics on e.g. Brighton
3. Bon Apetit

## Extras

## Where do you see possibilities to improve functionality
- Providing more team/season based statistics e.g. Seasons' Winning Team
- Highlighting crimes comitted on matchdays (If the crime API started to return the date within the month)
- Option to sort top table by League Position
- Retrieval of images from url on Football API and displayed on page
- Would focus Mobile First design + responsiveness
- Would also optimise number of requests sent to API's
- Would query another API to get nearest train station to a postcode, as I think that would also include relevant data
- Could query a news API to get news stories contained stadium name on the date of the crimes
- Allowing filtering of Crime Category and Outcome Status Category
- Allow searching on a Crime Identification number

## Feedback
- Quite an enjoyable technical, especially due to the subject and looseness of requirements
- The Crime API returning a 500 on "misses" definitely made me think it was down for a while until I tested it properly with Postman
- Football API only returning last 3 seasons also threw me off a little at the start as well until I looked at the "Free" membership
