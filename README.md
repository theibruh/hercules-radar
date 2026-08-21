# Hercules Radar

Hercules Radar is not deployed yet. It is still being built, and this README covers both the parts that already work and the direction the project is heading.

Today, it is a live flight tracking web app. It shows aircraft positions, flight details, and emergency squawk alerts on an interactive map, with updates running continuously.

The longer term goal is to turn it into a small space for people who genuinely enjoy aircraft. Live tracking stays at the centre, with a simple Logbook for public and private spotting posts, plus an AI assistant that can answer useful questions about the flight currently on screen.

The name comes from the Hughes H-4 Hercules, known as the Spruce Goose. It was the largest aircraft ever built, as well as the largest wooden aircraft and seaplane to ever fly. You can read the fuller story on the About page.

## Working now

**Live regional tracking.** Seven regions are available: Australia, Europe, North America, Asia, South America, Africa, and the Middle East. The app polls real ADS-B position data every 30 seconds.

**Smooth motion between updates.** Aircraft do not simply jump from one point to the next. Between each data poll, the map predicts movement in the browser using the aircraft speed and heading.

**Emergency squawk detection.** The app automatically highlights aircraft using emergency squawk codes: 7500 for hijack, 7600 for radio failure, and 7700 for a general emergency.

**Aircraft identification.** Each aircraft can show its registration, manufacturer, and model, along with a real photo when one is available.

**Route lookup.** The app can estimate an aircraft's origin and destination. Route details are loaded only when a flight card comes into view.

**Light and dark themes.** The interface uses a custom design token system, including a distinct earth tone light palette.

**About page.** Explains the story of the H-4 Hercules, the flight tracking pipeline, and how the app uses OpenSky Network data.

## In progress

**Logbook.** The plan is to let users post a plane spot, choose whether it is public or private, and browse a global feed of public posts from other spotters. Supabase authentication is already in place. The database schema, RLS policies, and interface still need to be finished.

**AI assistant per flight.** The interface already includes an "Ask AI about [callsign]" action, but it is not connected to a real backend yet.

## Tech stack

Framework: Next.js 16, App Router, Turbopack, React 19, and TypeScript

Styling: Tailwind CSS v4, CSS first configuration, and custom design tokens

Maps: Leaflet

Flight data: OpenSky Network with OAuth2 client credentials authentication

Aircraft photos and identification: planespotters.net and hexdb.io

Auth and database: Supabase, currently in progress

Fonts: Rajdhani, Geist Mono, and Source Serif 4

## Getting started

The app is inside the `hercules-radar-web/` directory.

```
cd hercules-radar-web
npm install
```

Create a `.env.local` file with the following values:

```
OPENSKY_CLIENT_ID=
OPENSKY_CLIENT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

OpenSky credentials are free. Create an account at OpenSky Network, then generate an API client from your account settings.

Start the development server:

```
npm run dev
```

## Dead reckoning

OpenSky only provides a fresh aircraft position every 30 seconds. Without any prediction, each aircraft would visibly jump across the map whenever a new poll arrives.

To make the motion feel smoother, FlightMap.tsx estimates the aircraft position on every animation frame. It starts from the last known latitude and longitude, then uses the aircraft heading and speed to predict where it should be until the next real update arrives: distance travelled is speed times elapsed seconds, the change in latitude comes from that distance times the cosine of the heading, and the change in longitude comes from that distance times the sine of the heading, divided by the cosine of the current latitude.

That last division matters. East to west distance does not map to longitude the same way everywhere on Earth. The closer an aircraft is to the poles, the larger the longitude change for the same real distance. Without that correction, aircraft at higher latitudes drift too far from their likely path. Once a new real position arrives, the predicted marker snaps back to the true location, and the process begins again from the fresh data.

## Roadmap

Finish the Logbook schema, RLS policies, and user interface

Connect the AI assistant to a working backend

Improve the mobile layout

Add a CI pipeline and test coverage

Deploy the app

## Why this project exists

Hercules Radar comes from a real interest in aviation and aircraft. It is where that interest meets the process of building software, with the aim of making something real rather than another tutorial project.

It is also my first solo full stack build from start to finish. The part I am most proud of is the dead reckoning work. The first version looked wrong at higher latitudes, and figuring out why pushed me to understand the geometry instead of just copying a formula.
