export type Location = {
  name: string;
  address: string;
  coordinates: GeoPoint;
};

export type GeoPoint = [number, number];
