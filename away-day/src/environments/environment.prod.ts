export const environment = {
  production: false,
  authToken: 'replace-to-use',
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
