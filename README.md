# AwayDay
Statistics for Crime Rates, at Premier League Stadiums, since the league began

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
so getting crime data for when demoted back to championship is a hurdle.

At this point we link it to crime data.
From my experience of match days, a lot of crime occurs not only at the stadium postcode
but the surrounding area/train stations, so loosening the "net" may be a good idea.

Once we have made the requests for each of the postcodes, within the timeframe of them
being within the Premier League, next comes the fun bit.

We sort this data, and group by season/year and try and find fun ways to display
this data to the user using Angular and Materials frontend.

# POA
I think it's more extensible to retrieve data by League Code instead of ID (but thanks for providing it)

# Running
To run this application
1. cd away-day
2. ng serve --open
