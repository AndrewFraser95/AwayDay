import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team, StadiumLocation, Crime } from './interfaces/interfaces';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private StadiumUrl = 'http://api.football-data.org/v2/competitions';
  private CrimesUrl = 'https://data.police.uk/api/crimes-at-location';
  private PostcodeUrl = 'https://api.postcodes.io/postcodes';

  // Use dateTime

  constructor(private httpClient: HttpClient) {}

  // Untested
  public sendTeamsGetRequest(leagueCode: string, year: string) {
    return this.httpClient
      .get<Team>(`${this.StadiumUrl}/${leagueCode}/teams?season=${year}`, {
        // Move this auth token to config or ideally have it replaced at deploy step
        headers: { 'X-Auth-Token': '669345fd07874b79a8e2443edc6e8382' },
      })
      .pipe(
        map((recieved: any) => {
          var listOfTeams: Team[] = [];
          recieved.teams.forEach((team: any) => {
            listOfTeams.push({
              name: team.name,
              address: team.address,
              founded: team.founded,
              website: team.website,
            });
          });
          return listOfTeams;
        })
      );
  }

  // Untested
  public sendPostcodeGetRequest(postcode: string) {
    return this.httpClient
      .get<StadiumLocation>(this.PostcodeUrl + '/' + postcode)
      .pipe(
        map((recieved: any) => {
          if (recieved.status === 200) {
            return {
              latitude: recieved.result.latitude,
              longitude: recieved.result.longitude,
            } as StadiumLocation;
          }
          // Postcode not found, handle
          return { latitude: '0', longitude: '0' } as StadiumLocation;
        })
      );
  }

  // Untested
  public sendCrimesGetRequest(
    year: string,
    month: string,
    lat: string,
    long: string
  ) {
    return this.httpClient.get<Crime[]>(
      this.CrimesUrl + `?date=${year}-${month}&lat=${lat}&lng=${long}`
    );
  }
}
