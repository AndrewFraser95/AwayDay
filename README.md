# AwayDay
Statistics for Crime Rates, at Premier League Stadiums, since the league began.

# Welcome
Welcome to Away Day - Safety (Pronouced safe-tay)

The attached code will run an angular web app that will
answer all of your investigative needs regarding football stadiums,
and their associative crime rate.

There will be various search functionality, but it will focus on crime rate.

Firstly to analyse the question.
A list of recorded crimes... (Step 2)
...for Premier League Football Stadiums. (Step 1)
...sorted by year and month (Step 3)

# (Step 1)
So my POA would be to query the Teams API for all with League Code of PL.
Nuances: Some teams will have entered and then left the league
so getting crime data for when demoted back to championship could be a hurdle.
This makes it easier to structure queries in a year-first format.
E.g. For a given year, there is a given arrangement of teams, of which had crime for said year.

# (Step 2)
At this point we link it to crime data.
From my experience of match days, a lot of crime occurs not only at the stadium postcode
but the surrounding area/train stations, so loosening the "net" could be an area of focus in the future.
E.g. Using a Maps API to query the nearest train & bus station, and the 10 most popular pubs in the area.

# (Step 3)
This step has been made slightly easier given our year-first approach.
So that a user chooses a year, followed by a team, and is then displayed all crime for that year and postcode
in a table, split across multiple pages.
Annoyingly I will have to create a list of the months as the Romans didn't want me to be able to alphatically sort.
Grouping by crime can be done fairly easily with an alpha-numeric sort.

# Running
To run this application
1. cd away-day
2. ng serve --open

# Instructions
1. Please choose a year from the dropdown
2. Then select 1 team from the first table that you would like statistics on
3. Bon Apetit