/**
 * Weather Service
 * Fetches current weather data from the free Open-Meteo public API.
 * No API key required. Uses geolocation coordinates (defaults to New Delhi).
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/** Parsed weather data for the UI */
export interface WeatherData {
  temperature: number;
  windSpeed: number;
  humidity: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
}

/** WMO weather code to human-readable description mapping */
const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Thunderstorm with heavy hail',
};

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);

  // Default coordinates: New Delhi, India
  private readonly latitude = 28.6139;
  private readonly longitude = 77.2090;

  private readonly apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${this.latitude}&longitude=${this.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day`;

  /**
   * Fetches current weather conditions.
   * Returns a parsed WeatherData observable.
   */
  getCurrentWeather(): Observable<WeatherData> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((response) => {
        const current = response.current;
        const code = current.weather_code;
        return {
          temperature: current.temperature_2m,
          windSpeed: current.wind_speed_10m,
          humidity: current.relative_humidity_2m,
          weatherCode: code,
          weatherDescription: WEATHER_CODES[code] ?? 'Unknown',
          isDay: current.is_day === 1,
        };
      })
    );
  }
}
