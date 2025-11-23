// 時間帯の型
export type TimePeriod =
  | "earlyMorning"
  | "morning"
  | "daytime"
  | "evening"
  | "night";

// 次のマジックアワー/ブルーモーメントの情報
export interface NextMoment {
  type: "magic" | "blue" | "halo";
  time: string;
  timeRange: string;
  period: "morning" | "evening";
  message: string;
  isHappening: boolean;
  visibility: "excellent" | "good" | "fair" | "poor";
}

// 太陽時刻データ
export interface SolarData {
  sunrise: string;
  sunset: string;
  golden_hour_morning_start: string;
  golden_hour_morning_end: string;
  golden_hour_evening_start: string;
  golden_hour_evening_end: string;
  blue_hour_morning_start: string;
  blue_hour_morning_end: string;
  blue_hour_evening_start: string;
  blue_hour_evening_end: string;
}

// 天気データ
export interface WeatherData {
  description: string;
  clouds: number;
  humidity: number;
  temperature: number;
  visibility: string;
  haloVisibility?: {
    score: number;
    level: string;
    message: string;
    factors: Record<string, string>;
  };
}

// APIレスポンス
export interface ForecastResponse {
  weather: WeatherData;
  solarTimes: {
    sunrise: string;
    sunset: string;
    goldenHour: string;
    blueHour: string;
  };
  visibility: {
    score: number;
    level: string;
    message: string;
    factors: Record<string, string>;
  };
  haloVisibility: {
    score: number;
    level: string;
    message: string;
    factors: Record<string, string>;
  };
  location: { lat: number; lng: number };
  timestamp: string;
}

// 位置情報
export interface Location {
  lat: number;
  lng: number;
}
