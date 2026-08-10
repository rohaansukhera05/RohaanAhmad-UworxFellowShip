# Week 2 — APIs & Webhooks

## Overview

This project demonstrates the use of **REST APIs, HTTP requests, JSON data, and webhooks** using Node.js.

The project has two main parts:

1. **API Demonstration** — Fetch live weather data for Lahore from the Open-Meteo API and save the response as a JSON file.
2. **Webhook Demonstration** — Read the retrieved weather data and send selected information to a webhook endpoint using an HTTP POST request.

The purpose of this project is to understand how applications communicate with external services through APIs and how data can be automatically sent to another service through webhooks.

---

# Objectives

The main objectives of this Week 2 project are to:

- Understand what an API is.
- Make an HTTP GET request to an external API.
- Retrieve and process JSON data.
- Work with a real-time external API.
- Save API responses to a local JSON file.
- Understand how webhooks work.
- Make an HTTP POST request.
- Send structured JSON data to a webhook.
- Handle API and webhook errors.
- Use Node.js and npm for a small API integration project.
- Document the complete implementation using GitHub.

---

# Technologies Used

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime used to execute the project |
| **JavaScript** | Programming language used for the implementation |
| **Axios** | Library used to make HTTP GET and POST requests |
| **Open-Meteo API** | External weather API used to retrieve live weather data |
| **Webhook.site** | Webhook endpoint used to test incoming POST requests |
| **JSON** | Format used for storing and transmitting structured data |
| **npm** | Package manager used to install project dependencies |
| **Git** | Version control |
| **GitHub** | Repository and project documentation |

---

# Project Structure

```text
Week2/
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
│
├── api-demo.js
├── api-response.json
│
├── webhook-demo.js
├── webhook-log.json
```

---

# Setup

Requires **Node.js 18 or newer**.

```bash
node --version
npm install
```

Open-Meteo requires **no API key and no signup**, so there is no secret to leak. That is the main reason it was chosen over key-based weather APIs.

---

# Part 1 — API Demonstration

```bash
node api-demo.js
```

Sends an HTTP GET request to the Open-Meteo API for Lahore's coordinates (31.5204, 74.3587), prints the current conditions, and writes the complete response to `api-response.json`.

```
Fetching live weather for Lahore, Pakistan...
GET https://api.open-meteo.com/v1/forecast

Status: 200 OK

Current weather in Lahore
----------------------------------
Condition:    Partly cloudy
Temperature:  37.9°C
Feels like:   41.3°C
Humidity:     48%
Wind speed:   12.6 km/h
Observed at:  2026-08-10T14:15 (Asia/Karachi)

Saved the full API response to api-response.json
Next step:  node webhook-demo.js
```

To use a different city, change `LATITUDE` and `LONGITUDE` at the top of the file. Coordinates for any city:

```
https://geocoding-api.open-meteo.com/v1/search?name=Karachi&count=1
```

### Notes on the implementation

- **The whole response is saved, not just the printed fields.** When an API behaves unexpectedly, having the raw JSON on disk is the fastest way to work out why.
- **Query parameters go in axios's `params` option.** Axios escapes them properly, so no manual string joining is needed.
- **Every request has a 10-second timeout.** Without one, a stalled request hangs the script forever with no explanation.
- **Open-Meteo reports conditions as WMO numeric codes**, not text. `describeWeather()` translates the common ones.

---

# Part 2 — Webhook Demonstration

First get a free endpoint: open **<https://webhook.site>**. It gives you a unique URL immediately, with no signup. Leave that tab open to watch requests arrive.

Then run, substituting your own URL:

```bash
# macOS / Linux
WEBHOOK_URL="https://webhook.site/your-unique-id" node webhook-demo.js

# Windows PowerShell
$env:WEBHOOK_URL="https://webhook.site/your-unique-id"; node webhook-demo.js

# Windows CMD
set WEBHOOK_URL=https://webhook.site/your-unique-id && node webhook-demo.js
```

The script reads `api-response.json`, extracts the useful fields, POSTs them as JSON, and records the attempt in `webhook-log.json`. The request then appears in your webhook.site tab.

Payload sent:

```json
{
  "event": "weather.reading",
  "sentAt": "2026-08-10T09:15:42.318Z",
  "city": "Lahore",
  "country": "Pakistan",
  "coordinates": { "latitude": 31.5204, "longitude": 74.3587 },
  "observedAt": "2026-08-10T14:15",
  "timezone": "Asia/Karachi",
  "condition": "Partly cloudy",
  "temperatureC": 37.9,
  "feelsLikeC": 41.3,
  "humidityPercent": 48,
  "windSpeedKmh": 12.6
}
```

### Notes on the implementation

- **Only selected fields are sent.** Forwarding the entire API response would force the receiver to dig through data it does not need. A webhook payload should be small and clearly named.
- **The webhook URL is masked in `webhook-log.json`.** Anyone holding your webhook.site URL can read everything sent to it, and this log gets committed to GitHub. It is stored as `https://webhook.site/8f3c1d9e...` rather than in full.
- **The URL comes from an environment variable, not the source code.** Endpoints and keys should never be hard-coded into files that get committed.
- **`api-response.json` is validated before use.** If it is missing or the wrong shape, the script says which command to run instead of crashing on `undefined`.

---

# Error Handling

Axios failures fall into three categories, and telling them apart is most of debugging an API call:

| Property present | Meaning | Typical cause |
|---|---|---|
| `error.response` | The server answered with 4xx or 5xx | Bad parameter, expired webhook URL |
| `error.request` | The request went out, nothing came back | No internet, firewall, VPN, dead host |
| neither | The request was never sent | Malformed URL, bad configuration |

Both scripts sort errors this way and print a message explaining what to check. Cases covered:

| Situation | Behaviour |
|---|---|
| API unreachable | Names the likely causes, gives a URL to test in a browser |
| API returns an HTTP error | Reports the status and that a parameter is probably wrong |
| `WEBHOOK_URL` not set | Prints setup instructions for macOS, Linux, and Windows |
| `api-response.json` missing | Says to run `node api-demo.js` first |
| `api-response.json` malformed | Says to delete it and regenerate |
| Webhook endpoint unreachable | Notes that webhook.site URLs expire |
| Webhook returns an HTTP error | Reports the status code |

Both scripts exit with code `1` on failure, so they work correctly in scripts and CI.

---


# Running the Whole Flow

```bash
npm install
node api-demo.js
WEBHOOK_URL="https://webhook.site/your-unique-id" node webhook-demo.js
```

Shortcuts:

```bash
npm run api
npm run webhook
```

---

# Possible Extensions

1. Send a 5-day forecast rather than only the current reading.
2. Add a `--city` command-line argument using the Open-Meteo geocoding endpoint.
3. Only send the webhook when the temperature crosses a threshold.
4. Retry a failed webhook three times with increasing delays, the way real providers do.
5. Sign the payload with HMAC-SHA256 so the receiver can verify it came from you.
6. Break something deliberately — a wrong URL, a deleted `api-response.json` — and confirm the error message actually explains what went wrong.
