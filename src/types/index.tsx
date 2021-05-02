export type CityAQIType = {
  city: string;
  aqi: number;
}

export type AQIHistoryType = {
  aqi: number;
  updatedAt: number;
}

export interface CityAQIData extends CityAQIType {
  updatedAt: number;
}

export interface CityAQIHistory extends CityAQIType {
  aqiHistory: Array<AQIHistoryType>;
}