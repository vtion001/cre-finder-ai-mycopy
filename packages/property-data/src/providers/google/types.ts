export type GooglePlacesSearchParams = {
  city?: string;
  county?: string;
  state?: string;
};

export type GooglePlaceGeometry = {
  location: {
    lat: number;
    lng: number;
  };
};

export type GooglePlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: GooglePlaceGeometry;
  business_status?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  vicinity?: string;
  price_level?: number;
  opening_hours?: {
    open_now?: boolean;
  };
};

export type GooglePlacesResponse = {
  results: GooglePlaceResult[];
  status: string;
  error_message?: string;
  next_page_token?: string;
};
