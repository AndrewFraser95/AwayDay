import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Team, StadiumLocation, Crimes } from './interfaces/interfaces';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private StadiumUrl = "http://api.football-data.org/v2/competitions";
  private CrimesUrl = "https://data.police.uk/api/crimes-at-location";
  private PostcodeUrl = "https://api.postcodes.io/postcodes";

  // Use dateTime
  private yearPlWasCreated = 1992;
  private currentYear = 2020;

  constructor(private httpClient: HttpClient) { }

  public getAllUniquePremierLeagueTeams(leagueCode: string){
    var allTeams: Team[] = [];
    for (let year = this.yearPlWasCreated; year <= this.currentYear; year++) {
      console.log(year)
      this.sendTeamsGetRequest(leagueCode, year).pipe(map((recieved: Team[]) => {
        allTeams = [...new Set([...allTeams, ...recieved])];
       }));
    }
    return of(allTeams);
  }

  // Untested
  public sendTeamsGetRequest(leagueCode: string, year: number = this.currentYear){
    return this.httpClient.get<Team>(`${this.StadiumUrl}/${leagueCode}/teams?season=${year}`,{
      // Move this auth token to config or ideally have it replaced at deploy step
      headers: { 'X-Auth-Token': '669345fd07874b79a8e2443edc6e8382'}
   }).pipe(map((recieved: any) => {
     var listOfTeams: Team[] = [];
     recieved.teams.forEach((team: any) => {
      listOfTeams.push(new Team(
        team.name,
        team.address,
        team.founded,
        team.website
      ));
     });
    return listOfTeams; 
  }))
  }

  // Untested
  public sendCrimesGetRequest(year: number, month: string, lat: number, long: number){
    return this.httpClient.get<Crimes>(this.CrimesUrl + `?date=${year}-${month}&lat=${lat}&lng=${long}`).pipe(map((recieved: any) => {
      if (recieved.status === 200) {
        console.log(recieved);
        return new Crimes(
          recieved.category,
          recieved.outcome_status.category,
        ); }
        // Postcode not found, handle
        return new Crimes('','');
      })
    );
  }

  // Untested
   public sendPostcodeGetRequest(postcode:string) {
    return this.httpClient.get<StadiumLocation>(this.PostcodeUrl + '/' + postcode).pipe(map((recieved: any) => {
      if (recieved.status === 200) {
        return new StadiumLocation(
          recieved.result.latitude,
          recieved.result.longitude,
        ); }
        // Postcode not found, handle
        return new StadiumLocation(0,0);
      })
    );
  }
}
