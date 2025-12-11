export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export const DEFAULT_LOCATION: Location = {
  name: "Bordeaux",
  latitude: 44.8378,
  longitude: -0.5792,
};
