// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authToken: '669345fd07874b79a8e2443edc6e8382',
  leagueCode: '2021', // This is the provided League Code for the EPL.
  stage: 'PL',
  club: 'N/A',
  yearSelected: 1992,
  teamSelected: -1,
  teamDisplayedColumns: ['select', 'name', 'address', 'founded', 'website'],
  crimeDisplayedColumns: [
    'id',
    'month',
    'category',
    'location_type',
    'outcome_status_category',
    'outcome_status_date',
  ],
  yearPlWasCreated: 2018, // Change to 1992 if API access is upgraded to all results
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
