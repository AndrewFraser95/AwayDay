import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Crime } from '../interfaces/interfaces';
import { RequestsService } from '../requests.service';

const defaultCrime: Crime[] = [
  {
    id: 'none',
    month: 'none',
    category: 'none',
    location_type: 'none',
    outcome_status: {
      category: 'none',
      date: 'none',
    },
  },
];

@Component({
  selector: 'crimes-component',
  templateUrl: './crimes.component.html',
  styleUrls: ['./crimes.component.scss'],
})
export class CrimesComponent implements AfterViewInit {
  @ViewChild(MatTable) crimeTable!: MatTable<any>;
  @ViewChild(MatPaginator) crimePaginator!: MatPaginator;
  @ViewChild(MatSort) crimeSort!: MatSort;

  resultsLength = 0;
  requestsService: RequestsService | null = null;
  crimeDataSource: MatTableDataSource<Crime>;

  crimeDisplayedColumns: string[] = [
    'id',
    'month',
    'category',
    'location_type',
    'outcome_status_category',
    'outcome_status_date',
  ];

  public yearSelected = 1992;
  public club = 'N/A';

  isLoadingCrimes = false;

  constructor(private _httpClient: HttpClient) {
    this.crimeDataSource = new MatTableDataSource(defaultCrime);
  }

  ngAfterViewInit() {
    this.requestsService = new RequestsService(this._httpClient);
    this.crimeDataSource.sort = this.crimeSort;
    this.crimeDataSource.paginator = this.crimePaginator;
  }

  public getCrimesForClub(
    lat: string,
    long: string,
    yearSelected: number,
    club: string
  ) {
    this.yearSelected = yearSelected;
    this.club = club;
    this.isLoadingCrimes = true;
    let crimes: Crime[] = [];
    for (let month = 1; month <= 12; month++) {
      const monthString = month < 10 ? `0${month}` : `${month}`;
      this.requestsService!.sendCrimesGetRequest(
        yearSelected.toString(),
        monthString,
        lat,
        long
      ).subscribe((data: Crime[]) => {
        this.isLoadingCrimes = true;
        data.forEach((crime) => {
          if (crime != null) {
            crimes.push({
              id: crime.id,
              month: this.getMonthName(crime.month),
              category: this.getCategory(crime.category),
              location_type: crime.location_type,
              outcome_status: this.getOutcomeStatus(crime.outcome_status),
            });
          }
        });
        this.isLoadingCrimes = false;
        this.resultsLength = crimes.length;

        this.crimeDataSource.data = [...crimes];
        this.crimeDataSource.sort = this.crimeSort;
        this.crimeDataSource.paginator = this.crimePaginator;
        this.crimeTable.renderRows();
      });
    }
  }

  //#region Helpers

  protected getCategory(category: any) {
    if (category != null) {
      return category
        .split('-')
        .map((word: string) => {
          return word[0].toUpperCase() + word.substring(1);
        })
        .join(' ');
    }
    return { category: 'Category Unknown' };
  }

  protected getMonthName(dateString: string) {
    if (dateString != null) {
      const monthString = dateString.split('-')[1];
      return monthString;
    }
    return 'Month Unknown';
  }

  protected getOutcomeStatus(outcome_status: any) {
    if (outcome_status != null) {
      return {
        category: outcome_status.category,
        date: outcome_status.date,
      };
    }
    return { category: 'Outcome Unknown', date: 'Date Unknown' };
  }

  //#endregion
}
