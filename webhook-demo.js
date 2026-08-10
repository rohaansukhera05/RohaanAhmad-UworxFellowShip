/**
 * webhook-demo.js — Week 2, Part 2
 *
 * Reads the weather data saved by api-demo.js, picks out the useful fields,
 * and POSTs them to a webhook endpoint. Every attempt is recorded in
 * webhook-log.json.
 *
 * Run api-demo.js first, then:
 *
 *   macOS / Linux:
 *     WEBHOOK_URL="https://webhook.site/your-unique-id" node webhook-demo.js
 *
 *   Windows PowerShell:
 *     $env:WEBHOOK_URL="https://webhook.site/your-unique-id"; node webhook-demo.js
 *
 *   Windows CMD:
 *     set WEBHOOK_URL=https://webhook.site/your-unique-id && node webhook-demo.js
 *
 * Get your unique URL by opening https://webhook.site — it gives you one
 * straight away, no signup. Leave the tab open to watch requests arrive.
 */

import axios from "axios";
import { readFile, writeFile } from "node:fs/promises";

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const INPUT_FILE = "api-response.json";
const LOG_FILE = "webhook-log.json";

/** Same WMO lookup as api-demo.js. */
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
 * Your webhook.site URL is effectively a password: anyone who has it can read
 * everything you send there. Since webhook-log.json gets committed to GitHub,
 * the URL is masked before being written.
 */
function maskUrl(url) {
  try {
    const parsed = new URL(url);
    const id = parsed.pathname.replace(/^\//, "");
    const masked = id.length > 8 ? `${id.slice(0, 8)}...` : "...";
    return `${parsed.origin}/${masked}`;
  } catch {
    return "(could not parse URL)";
  }
}

/** Read the log, add one entry, write it back. */
async function appendToLog(entry) {
  let log = [];

  try {
    log = JSON.parse(await readFile(LOG_FILE, "utf8"));
    if (!Array.isArray(log)) log = [];
  } catch {
    // No file yet, or its contents were not valid JSON. Either way, start fresh.
    log = [];
  }

  log.push(entry);
  await writeFile(LOG_FILE, JSON.stringify(log, null, 2) + "\n");
  return log.length;
}

/** Same three-way split as api-demo.js — see the comment there. */
function explainError(error) {
  if (error.response) {
    return `The webhook endpoint replied with ${error.response.status} ${error.response.statusText}.`;
  }
  if (error.request) {
    return (
      `No response came back from the webhook endpoint.\n` +
      `Check that you are online and that the URL in WEBHOOK_URL is still valid.\n` +
      `webhook.site URLs expire after a period of inactivity — open the page again\n` +
      `to confirm yours is still live.`
    );
  }
  return `The request was never sent: ${error.message}`;
}

async function main() {
  // --- Check the URL is set before doing anything else ---
  if (!WEBHOOK_URL) {
    console.error("WEBHOOK_URL is not set.\n");
    console.error("1. Open https://webhook.site and copy your unique URL.");
    console.error("2. Run this script with it, for example:\n");
    console.error('   WEBHOOK_URL="https://webhook.site/your-unique-id" node webhook-demo.js\n');
    console.error("   On Windows PowerShell:");
    console.error('   $env:WEBHOOK_URL="https://webhook.site/your-unique-id"; node webhook-demo.js');
    process.exit(1);
  }

  // --- Read what api-demo.js saved ---
  let saved;
  try {
    saved = JSON.parse(await readFile(INPUT_FILE, "utf8"));
  } catch {
    console.error(`Could not read ${INPUT_FILE}.`);
    console.error(`Run the first script to create it:  node api-demo.js`);
    process.exit(1);
  }

  const current = saved.data?.current;
  if (!current) {
    console.error(`${INPUT_FILE} does not look like an Open-Meteo response.`);
    console.error(`Delete it and run:  node api-demo.js`);
    process.exit(1);
  }

  // --- Pick out only what is worth sending ---
  // Webhooks should carry a small, clearly-named payload. Forwarding the entire
  // API response would make the receiver dig through fields it does not need.
  const payload = {
    event: "weather.reading",
    sentAt: new Date().toISOString(),
    city: saved.city,
    country: saved.country,
    coordinates: saved.coordinates,
    observedAt: current.time,
    timezone: saved.data.timezone,
    condition: describeWeather(current.weather_code),
    temperatureC: current.temperature_2m,
    feelsLikeC: current.apparent_temperature,
    humidityPercent: current.relative_humidity_2m,
    windSpeedKmh: current.wind_speed_10m,
  };

  console.log(`Read weather data for ${payload.city} from ${INPUT_FILE}`);
  console.log(`Sending to ${maskUrl(WEBHOOK_URL)}\n`);
  console.log("Payload:");
  console.log(JSON.stringify(payload, null, 2));

  // --- Send it ---
  const response = await axios.post(WEBHOOK_URL, payload, {
    headers: {
      "Content-Type": "application/json",
      "X-Event-Type": payload.event,
    },
    timeout: 10000,
  });

  console.log(`\nWebhook responded: ${response.status} ${response.statusText}`);

  // --- Record what happened ---
  const total = await appendToLog({
    sentAt: payload.sentAt,
    endpoint: maskUrl(WEBHOOK_URL), // masked on purpose — see maskUrl above
    payload,
    response: {
      status: response.status,
      statusText: response.statusText,
    },
  });

  console.log(`Logged to ${LOG_FILE} (${total} entr${total === 1 ? "y" : "ies"} total)`);
  console.log(`\nCheck your webhook.site tab — the request should be listed there.`);
}

main().catch((error) => {
  console.error(`\nCould not deliver the webhook.\n`);
  console.error(explainError(error));
  process.exit(1);
});
