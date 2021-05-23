export interface Team {
  name: string;
  address: string;
  founded: string;
  website: string;
}

export interface StadiumLocation {
  latitude: string;
  longitude: string;
}

export interface Crime {
  id: string;
  month: string;
  category: string;
  location_type: string;
  outcome_status: {
    category: string;
    date: string;
  };
}
