export type Transport = 'car' | 'train';

export type Category =
  | 'nature'
  | 'onsen'
  | 'history'
  | 'gourmet'
  | 'famous';

export interface Spot {
  name: string;
  description: string;
  address: string;
  website: string | null;
  photoUrl: string | null;
  rating: number | null;
  placeId: string;
  lat: number;
  lng: number;
}

export interface RouteInfo {
  origin: string;
  destination: string;
  transport: Transport;
  categories: Category[];
  waypoints: { lat: number; lng: number }[];
}

export interface AffiliateLinks {
  hotel: string;
  rental: string | null;
}
