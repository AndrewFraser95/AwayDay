import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { CrimesComponent } from './crimes/crimes.component';
import { RequestsService } from './requests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [CrimesComponent],
})
export class AppComponent {
  @ViewChild(CrimesComponent) crime: CrimesComponent;
  showTeamsTable = true;
  showCrimesTable = false;

  requestsService: RequestsService | null = null;
  constructor(private _httpClient: HttpClient) {
    this.crime = new CrimesComponent(_httpClient);
  }

  // Untested
  public getLatitideAndLongitudeForPostcode(inputs: string[]) {
    this.requestsService = new RequestsService(this._httpClient);

    this.showCrimesTable = true;
    this.showTeamsTable = false;

    const postcode = this.parsePostcodeFromAddress(inputs[0]);
    this.requestsService!.sendPostcodeGetRequest(postcode).subscribe(
      (location) => {
        this.crime.getCrimesForClub(
          location.latitude,
          location.longitude,
          parseInt(inputs[1]),
          inputs[2]
        );
      }
    );
  }

  //#region Helpers

  // Untested
  public hideCrimeTable() {
    this.showCrimesTable = false;
    this.showTeamsTable = true;
  }

  // Untested
  protected parsePostcodeFromAddress(address: string) {
    var addressParts = address.split(' ');
    return `${addressParts[addressParts.length - 2]} ${
      addressParts[addressParts.length - 1]
    }`;
  }

  //#endregion
}
