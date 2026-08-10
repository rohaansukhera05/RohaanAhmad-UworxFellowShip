/**
 * api-demo.js — Week 2, Part 1
 *
 * Fetches live weather data for Lahore from the Open-Meteo API and saves the
 * full response to api-response.json.
 *
 * Run it:
 *   node api-demo.js
 *   npm run api
 *
 * Open-Meteo is free and needs no API key, so there is no secret to leak and
 * nothing to sign up for. Run webhook-demo.js afterwards to forward this data on.
 */

import axios from "axios";
import { writeFile } from "node:fs/promises";

// Lahore, Punjab, Pakistan.
// To use a different city, look its coordinates up here:
// https://geocoding-api.open-meteo.com/v1/search?name=Karachi&count=1
const CITY = "Lahore";
const COUNTRY = "Pakistan";
const LATITUDE = 31.5204;
const LONGITUDE = 74.3587;

const API_URL = "https://api.open-meteo.com/v1/forecast";
const OUTPUT_FILE = "api-response.json";

/**
 * Open-Meteo reports the weather as a number (a WMO code), not as text.
 * This translates the common ones. Full list: https://open-meteo.com/en/docs
 */
function describeWeather(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Freezing fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Light snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
  };

  return descriptions[code] ?? `Unknown weather code (${code})`;
}

/**
 * axios errors come in three flavours, and telling them apart is most of
 * debugging an API call:
 *
 *   error.response  the server answered, but with 4xx or 5xx
 *   error.request   the request went out and nothing came back
 *   neither         the request was never sent (bad config, bad URL)
 */
function explainError(error) {
  if (error.response) {
    return (
      `The API replied with ${error.response.status} ${error.response.statusText}.\n` +
      `That means the request arrived but was rejected — usually a bad parameter.`
    );
  }

  if (error.request) {
    return (
      `No response came back from the API.\n` +
      `Check that you are online, then try opening this in a browser:\n` +
      `${API_URL}?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m\n` +
      `If that page loads but this script does not, something local is blocking it\n` +
      `(a firewall, a VPN, or a school or office network).`
    );
  }

  return `The request was never sent: ${error.message}`;
}

async function main() {
  console.log(`Fetching live weather for ${CITY}, ${COUNTRY}...`);
  console.log(`GET ${API_URL}\n`);

  // axios builds the query string from `params`, so spaces and symbols are
  // escaped correctly without any manual string joining.
  const response = await axios.get(API_URL, {
    params: {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
      timezone: "auto",
    },
    // Without a timeout a stalled request waits forever and the script just hangs.
    timeout: 10000,
  });

  const data = response.data;
  const now = data.current;
  const units = data.current_units;

  console.log(`Status: ${response.status} ${response.statusText}\n`);
  console.log(`Current weather in ${CITY}`);
  console.log("-".repeat(34));
  console.log(`Condition:    ${describeWeather(now.weather_code)}`);
  console.log(`Temperature:  ${now.temperature_2m}${units.temperature_2m}`);
  console.log(`Feels like:   ${now.apparent_temperature}${units.apparent_temperature}`);
  console.log(`Humidity:     ${now.relative_humidity_2m}${units.relative_humidity_2m}`);
  console.log(`Wind speed:   ${now.wind_speed_10m} ${units.wind_speed_10m}`);
  console.log(`Observed at:  ${now.time} (${data.timezone})`);

  // Save the WHOLE response, not just the fields printed above. When an API
  // surprises you, having the raw JSON on disk is the quickest way to find out why.
  const saved = {
    savedAt: new Date().toISOString(),
    source: "Open-Meteo",
    city: CITY,
    country: COUNTRY,
    coordinates: { latitude: LATITUDE, longitude: LONGITUDE },
    httpStatus: response.status,
    data,
  };

  await writeFile(OUTPUT_FILE, JSON.stringify(saved, null, 2) + "\n");

  console.log(`\nSaved the full API response to ${OUTPUT_FILE}`);
  console.log(`Next step:  node webhook-demo.js`);
}

main().catch((error) => {
  console.error(`\nCould not fetch the weather data.\n`);
  console.error(explainError(error));
  process.exit(1);
});
