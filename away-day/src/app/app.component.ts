import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { startWith, switchMap, map, catchError, mergeMap, concatMap } from 'rxjs/operators';
import { StadiumLocation, Team } from './interfaces/interfaces';
import { RequestsService } from './requests.service';
import {merge, of as observableOf, of} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'address', 'founded', 'website'];
  requestsService: RequestsService | null = null;
  data: Team[] = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  public leagueCode = 'PL';
  public crimes: Object ={};
  public postcode: Object ={};

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private _httpClient: HttpClient) { }

  ngAfterViewInit() {
    this.requestsService = new RequestsService(this._httpClient);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.requestsService!.getAllUniquePremierLeagueTeams(this.leagueCode)}),
        map((data) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.length;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if any of the API's has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  // ngOnInit() {
  //   this.getListOfPremierLeagueTeams();

    //For every season they have on record on the db.
    //Get all clubs for that season
    //From that create a unique list of all clubs that have ever played in the PL
    //Get the postcode of each of these clubs
    //And looping through every day on record
    //Collate the crime rate for each of the clubs.
  // }

  public getListOfPremierLeagueTeams() {
    this.requestsService!.sendTeamsGetRequest(this.leagueCode, 2000).subscribe((plTeams: Team[])=>{
      const postcode = this.parsePostcodeFromAddress(plTeams[0].address);
      this.getLatitideAndLongitudeForPostcode(postcode);
    }); 
  }

  public getLatitideAndLongitudeForPostcode(postcode: string) {
    this.requestsService!.sendPostcodeGetRequest(postcode).subscribe((location: StadiumLocation)=>{
      const currentYear = 2020;
      const startOfRecords = 1990;
      for (let year = currentYear; year > startOfRecords; year--) {
        for (let month = 1; month <= 12; month++) {
          const monthString = month < 10 ? `0${month}` : `${month}`;
          this.getCrimes(year, monthString, location.latitude, location.longitude);
      }
      }
    });
  }

  public getCrimes(year: number, month: string, lat: number, long: number) {
    this.requestsService!.sendCrimesGetRequest(year, month, lat, long).subscribe(
      data => console.log('success', data)
    );
  }


  // Helpers

  protected parsePostcodeFromAddress(address: string){
      var addressParts = address.split(' ');
      return `${addressParts[addressParts.length - 2]} ${addressParts[addressParts.length - 1]}`;
  }

}
