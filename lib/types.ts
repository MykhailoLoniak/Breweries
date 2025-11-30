export interface Brewery {
  id: string;
  name: string;
  brewery_type: string;
  address_1: string;
  address_2: string | null;
  address_3: string | null;
  city: string;
  state_province: string;
  state: string;
  street: string;
  postal_code: string;
  country: string;
  longitude: null | string;
  latitude: null | string;
  phone: string;
  website_url: string;
}
