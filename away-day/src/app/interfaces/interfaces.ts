  export class StadiumLocation {
    latitude: number;
    longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
      }
  }

  export class Team {
    name: string;
    address: string;
    founded: string;
    website: string;

    constructor (name: string, address: string, founded: string, website: string) {
      this.name = name;
      this.address = address;
      this.founded = founded;
      this.website = website;
     }
  }

  export class Crimes {
    category: string;
    outcomeStatusCategory: string;

    constructor(category: string, outcomeStatusCategory: string) {
        this.category = category;
        this.outcomeStatusCategory = outcomeStatusCategory;
      }
  }