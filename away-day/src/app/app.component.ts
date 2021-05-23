import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Crime, Team } from './interfaces/interfaces';
import { RequestsService } from './requests.service';
import { merge, of as observableOf } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

let defaultTeam: Team[] = [
  { name: 'none', address: 'none', founded: 'none', website: 'none' },
];

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) crimePaginator!: MatPaginator;
  @ViewChild(MatSort) teamSort!: MatSort;
  @ViewChild(MatSort) crimeSort!: MatSort;

  teamDataSource: MatTableDataSource<Team>;
  crimeDataSource: MatTableDataSource<Crime>;
  requestsService: RequestsService | null = null;

  teamDisplayedColumns: string[] = [
    'select',
    'name',
    'address',
    'founded',
    'website',
  ];
  crimeDisplayedColumns: string[] = [
    'id',
    'month',
    'category',
    'location_type',
    'outcome_status_category',
    'outcome_status_date',
  ];

  resultsLength = 0;
  isLoadingTeams = false;
  isLoadingCrimes = false;

  // This is the provided League Code for the EPL.
  public leagueCode = '2021';

  // API currently only returns data in last 3 years
  // If I had more time I would query competition to get count
  public yearList: number[] = [];
  private yearPlWasCreated = 2018; // Change to 1992 if API access is upgraded to all results
  private currentYear = new Date().getFullYear() - 1; // As if a season isn't complete it won't be returned

  public yearSelected = '*Not yet selected*';
  public club = '*Not yet selected*';

  constructor(private _httpClient: HttpClient) {
    this.teamDataSource = new MatTableDataSource(defaultTeam);
    this.crimeDataSource = new MatTableDataSource(defaultCrime);
  }

  ngOnInit() {
    for (var i = this.yearPlWasCreated; i <= this.currentYear; i++) {
      this.yearList.push(i);
    }
    this.refresh();
  }

  ngAfterViewInit() {
    this.requestsService = new RequestsService(this._httpClient);

    this.teamDataSource.sort = this.teamSort;

    this.crimeDataSource.sort = this.crimeSort;
    this.crimeDataSource.paginator = this.crimePaginator;
  }

  public getTeamsForSeason() {
    this.isLoadingTeams = true;
    this.teamDataSource.data = [];
    this.crimeDataSource.data = [];
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingTeams = true;
          return this.requestsService!.sendTeamsGetRequest(
            this.leagueCode,
            this.yearSelected
          );
        }),
        map((data) => {
          this.isLoadingTeams = false;

          return data;
        }),
        catchError(() => {
          this.teamDataSource.data = [
            {
              name: 'not found',
              address: 'not found',
              founded: 'not found',
              website: 'not found',
            },
          ];
          this.isLoadingTeams = false;
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        this.teamDataSource.data = [...data];
        this.teamDataSource.sort = this.teamSort;
        this.table.renderRows();
      });
  }

  public getCrimesForClub(lat: string, long: string) {
    this.isLoadingCrimes = true;
    let crimes: Crime[] = [];
    for (let month = 1; month <= 12; month++) {
      const monthString = month < 10 ? `0${month}` : `${month}`;
      this.requestsService!.sendCrimesGetRequest(
        this.yearSelected,
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
        this.table.renderRows();
      });
    }
  }

  refresh(): void {
    this.table.renderRows();
  }

  //#region Checkbox Logic
  selection = new SelectionModel<Team>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.teamDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.teamDataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Team): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.name
    }`;
  }

  checkboxClicked(evt: Event, row: Team) {
    this.club = row.name;
    this.getLatitideAndLongitudeForPostcode(row.address);
    evt.stopPropagation();
  }

  //#endregion

  public getLatitideAndLongitudeForPostcode(address: string) {
    const postcode = this.parsePostcodeFromAddress(address);
    this.requestsService!.sendPostcodeGetRequest(postcode).subscribe(
      (location) => {
        this.getCrimesForClub(location.latitude, location.longitude);
      }
    );
  }

  // Helpers

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.teamDataSource.filter = filterValue.trim().toLowerCase();

    if (this.teamDataSource.paginator) {
      this.teamDataSource.paginator.firstPage();
    }
  }

  protected parsePostcodeFromAddress(address: string) {
    var addressParts = address.split(' ');
    return `${addressParts[addressParts.length - 2]} ${
      addressParts[addressParts.length - 1]
    }`;
  }

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

  protected getMonthName(monthString: string) {
    if (monthString != null) {
      const monthNumber = monthString.split('-')[1];
      return new Date(2021, parseInt(monthNumber), 1).toLocaleString(
        'default',
        {
          month: 'short',
        }
      );
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
}
