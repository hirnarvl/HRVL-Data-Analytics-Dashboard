import { LiveWeatherData } from '../types/riskMap';

const clientWeatherCache = new Map<string, { timestamp: number; data: LiveWeatherData }>();
const CLIENT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in-memory

export async function fetchLiveWeather(
  lat: number,
  lng: number,
  locationName: string = 'Hararghe Region'
): Promise<LiveWeatherData> {
  const cacheKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const now = Date.now();
  const cached = clientWeatherCache.get(cacheKey);

  if (cached && now - cached.timestamp < CLIENT_CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}&name=${encodeURIComponent(locationName)}`);
    if (!res.ok) {
      throw new Error(`Weather API returned status ${res.status}`);
    }
    const data: LiveWeatherData = await res.json();
    clientWeatherCache.set(cacheKey, { timestamp: now, data });
    return data;
  } catch (error) {
    console.warn(`Could not reach /api/weather for [${lat}, ${lng}]:`, error);
    // Return resilient local fallback
    const isHighland = lat > 9.0 && lng > 41.0;
    const fallback: LiveWeatherData = {
      latitude: lat,
      longitude: lng,
      locationName,
      timestamp: new Date().toISOString(),
      temperature: isHighland ? 21.0 : 26.5,
      apparentTemperature: isHighland ? 20.5 : 27.0,
      relativeHumidity: isHighland ? 60 : 50,
      precipitation: 0.0,
      windSpeed: 12.0,
      windDirection: 80, // East-Northeast
      windGusts: 16.0,
      surfacePressure: isHighland ? 820 : 915,
      weatherCode: 2,
      weatherCondition: 'Partly cloudy (Offline Climatological Mode)',
      isDay: true,
      source: 'HRVL Local Veterinary Climatological Model',
      isStaleOrOffline: true
    };
    return fallback;
  }
}

/**
 * Calculates a wind compass label from degrees
 */
export function getWindCompassDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}
