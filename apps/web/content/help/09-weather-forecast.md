---
title: Weather and Inspection Forecast
summary: The hourly inspection forecast grid, colour meanings, how the 0-100 score is calculated, hard limits, units and the heat penalty.
keywords: forecast, weather, score, inspection time, best time to inspect, grid, wind, rain, temperature, humidity, cloud, heat penalty, comb slump, units, celsius, fahrenheit, open-meteo
---

# Weather and Inspection Forecast

## Opening the forecast

Open an apiary and tap **📊 View Forecast**. The forecast uses the apiary's location (postal code or coordinates), so an apiary without a valid location cannot show one.

## Reading the grid

- Columns are the next days (a 7-day forecast), rows are hours from **6am to 5pm** in the apiary's local time.
- Each cell is a score from 0–100 for opening a hive in that hour. Colours:

| Score | Colour | Label |
|---|---|---|
| 85+ | dark green | Excellent |
| 70–84 | green | Good |
| 55–69 | amber | Fair |
| 40–54 | orange | Poor |
| below 40 | red | Not recommended |

- **White numbers = OK to inspect. Black numbers = not recommended** (score below 40, or a hard-limit problem such as rain).
- **Tap a cell** for details: the five factor scores, any **Issues**, and a **Good Conditions** list.
- **How are scores calculated?** opens an explanation inside the app.
- Units follow the apiary's country: US postal codes use °F, mph and 12-hour times; other countries use °C, km/h and 24-hour times.
- Weather data comes from Open-Meteo; the app picks a regional model (GFS for the Americas, ICON for Europe, ECMWF elsewhere).

## How the score is calculated (max 100)

| Factor | Max | Scoring |
|---|---|---|
| Temperature | 40 | 75°F+ (24°C) 40; 70°F 37; 65°F 33; 60°F 27; 57°F 18; 55°F 8; below 55°F 0 |
| Cloud cover | 20 | up to 20% clouds 20; to 40% 17; to 60% 12; above 60% 6 |
| Wind | 20 | up to 5 mph 20; 10 mph 18; 15 mph 12; 20 mph 6; 24 mph 2; above 24 mph 0 |
| Rain probability | 15 | 0% 15; up to 10% 12; 20% 8; 35% 4; 49% 1; above 49% 0 |
| Humidity | 5 | 30–70% gives 5, otherwise 0 |

## Hard limits (score shown in black)

Any of these marks an hour "not recommended": temperature below 55°F (13°C); wind above 24 mph (39 km/h); rain chance above 49%; rain falling now; thunderstorm conditions; or a total score below 40.

## Heat penalty

Wax comb can slump in high heat. Above 80°F (27°C) the temperature score loses 10 points for every full 5°F (3°C) above 80°F — for example 85°F loses 10 and 90°F loses 20. Above 92°F (33°C) the hour is flagged "comb slump risk". The forecast grid applies this penalty to all hive types.

## Weather chip on the apiary list

On wide screens, selecting an apiary on the list screen shows a small chip with the current or next hour's temperature, condition, wind and rain chance, tinted green (score 80+), yellow (60–79) or red (below 60). If the apiary has only a postal code, the app looks up and saves its coordinates the first time.

## Standalone Hive Forecast

**Get Standalone Forecast App →** (bottom of the forecast screen) opens forecast.beektools.com, a separate forecast app where you can enter any postal code.
