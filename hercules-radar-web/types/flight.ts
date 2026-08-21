export type Flight = {
  icao24: string;
  callsign: string | null;
  country: string | null;
  longitude: number | null;
  latitude: number | null;
  altitude: number | null;
  onGround: boolean;
  speed: number | null;
  heading: number | null;
  squawk: string | null;
  category: number | null;
};
