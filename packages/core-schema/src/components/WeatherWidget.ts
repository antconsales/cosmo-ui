/**
 * WeatherWidget Component Schema
 * Compact weather display - glanceable info for wearables
 */

export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "rain"
  | "heavy-rain"
  | "thunderstorm"
  | "snow"
  | "sleet"
  | "fog"
  | "windy"
  | "hail";

export type WeatherWidgetVariant = "default" | "compact" | "detailed" | "glass";

export type WeatherWidgetSize = "small" | "medium" | "large";

export interface WeatherForecastHour {
  time: string;
  temperature: number;
  condition: WeatherCondition;
  precipitation?: number;
}

export interface WeatherForecastDay {
  date: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  precipitation?: number;
}

export interface WeatherWidget {
  /** Unique identifier */
  id: string;
  /** Location name */
  location: string;
  /** Current temperature */
  temperature: number;
  /** Temperature unit */
  unit?: "celsius" | "fahrenheit";
  /** Feels like temperature */
  feelsLike?: number;
  /** Current condition */
  condition: WeatherCondition;
  /** Humidity percentage */
  humidity?: number;
  /** Wind speed */
  windSpeed?: number;
  /** Wind direction */
  windDirection?: string;
  /** UV index */
  uvIndex?: number;
  /** Air quality index */
  airQuality?: number;
  /** Visual variant */
  variant?: WeatherWidgetVariant;
  /** Size */
  size?: WeatherWidgetSize;
  /** Hourly forecast */
  hourlyForecast?: WeatherForecastHour[];
  /** Daily forecast */
  dailyForecast?: WeatherForecastDay[];
  /** Last updated timestamp */
  updatedAt?: string;
  /** Sunrise time */
  sunrise?: string;
  /** Sunset time */
  sunset?: string;
}
