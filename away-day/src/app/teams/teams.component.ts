import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { merge, of as observableOf } from 'rxjs';
import { startWith, switchMap, map, catchError } from 'rxjs/operators';
import { Team } from '../interfaces/interfaces';
import { RequestsService } from '../requests.service';
import { environment } from './../../environments/environment';

let defaultTeam: Team[] = [
  { name: 'none', address: 'none', founded: 'none', website: 'none' },
];

@Component({
  selector: 'teams-component',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss'],
})
export class TeamsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) teamsTable!: MatTable<any>;
  @ViewChild(MatSort) teamSort!: MatSort;
  @Output() requestCrimesEvent = new EventEmitter<string[]>();

  teamDataSource: MatTableDataSource<Team>;
  isLoadingTeams = false;
  requestsService: RequestsService | null = null;

  public yearSelected = environment.yearSelected;
  public teamDisplayedColumns = environment.teamDisplayedColumns;
  private club = environment.club;
  private teamSelected = environment.teamSelected;

  // API currently only returns data in last 3 years
  // If I had more time I would query competition endpoint to get all values
  public yearList: number[] = [];
  private currentYear = new Date().getFullYear() - 1; // If a season isn't complete it won't be returned

  constructor(private _httpClient: HttpClient) {
    this.teamDataSource = new MatTableDataSource(defaultTeam);
  }

  ngOnInit() {
    this.requestsService = new RequestsService(this._httpClient);
    for (var i = environment.yearPlWasCreated; i <= this.currentYear; i++) {
      this.yearList.push(i);
    }
    this.refresh();
  }

  refresh(): void {
    this.teamsTable.renderRows();
  }

  ngAfterViewInit(): void {
    this.teamDataSource.sort = this.teamSort;
  }

  // Untested
  public getTeamsForSeason() {
    this.isLoadingTeams = true;
    this.teamDataSource.data = [];
    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingTeams = true;
          return this.requestsService!.sendTeamsGetRequest(
            environment.leagueCode,
            environment.stage,
            this.yearSelected.toString()
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
      .subscribe((data: any) => {
        this.teamDataSource.data = [...data];
        this.teamDataSource.sort = this.teamSort;
        this.teamsTable.renderRows();
      });
  }

  //#region Checkbox Logic
  selection = new SelectionModel<Team>(true, []);

  // Untested
  checkboxClicked(evt: Event, row: Team) {
    var checkboxParent = evt.target as HTMLElement;
    var checkbox = checkboxParent.firstChild as HTMLInputElement;
    if (checkbox.checked === false) {
      this.club = row.name;
      this.requestCrimes(row);
      evt.stopPropagation();
    }
  }

  // Untested
  checkboxChange(row: Team, index: number) {
    this.teamSelected = index;
    this.selection.toggle(row);
  }

  // Untested
  checkboxSelected(index: number): boolean {
    return this.teamSelected === index;
  }

  //#endregion

  //#region Helpers

  // Untested
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.teamDataSource.filter = filterValue.trim().toLowerCase();

    if (this.teamDataSource.paginator) {
      this.teamDataSource.paginator.firstPage();
    }
  }

  // Untested
  requestCrimes(row: Team) {
    this.requestCrimesEvent.emit([
      row.address,
      this.yearSelected.toString(),
      this.club,
    ]);
  }

  //#endregion
}
