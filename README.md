# AwayDay
Statistics for Crime Rates, at Premier League Stadiums, since the league began.

# Welcome
Welcome to Away Day - Safety (Pronouced safe-tay)

The attached code will run an angular web app that will
answer all of your investigative needs regarding football stadiums,
and their associative crime rate.

Firstly to analyse the question.

A list of recorded crimes... (Step 2)

...for Premier League Football Stadiums. (Step 1)

...sorted by year and month (Step 3)

# (Step 1)
So my POA would be to query the Teams API for all with League Code of PL.
#### Nuances: Some teams will have entered and then left the league

So getting crime data for when demoted back to championship could be a hurdle.
This makes it easier to structure queries in a year-first format.
E.g. For a given year, there is a given arrangement of teams, of which had crime for said year.

# (Step 2)
At this point we need to link it to crime data.
This step has been made slightly easier given our year-first approach.
Because a user has already chosen a year and team, so we have the postcode of the stadium and the year at this point.
So next we query the postcode API for the latitude and longitude and then query the crime API.

# (Step 3)
We already are presenting the user with crime data filtered by the season, so that all teams and their postcodes
are relevant for the year in question.
At which point we are just doing a fairly tin-plate alpha-numeric sort if the month is in a 'mm' format

# Running
To run this application
1. cd away-day
2. ng serve --open

# Instructions
1. Please choose a year from the dropdown e.g. 2019
2. Then select 1 team from the first table that you would like statistics on e.g. Brighton
3. Bon Apetit

### Extras

## Where do you see possibilities to improve functionality
- Providing more team/season based statistics e.g. Seasons' Winning Team
- Highlighting crimes comitted on matchdays (If the crime API ever returned a date)
- Option to sort top table by League Position
- Option to sort by month correctly (and not alphabetically)
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
- Football API only returning last 3 seasons also threw me off a little at the start as well
