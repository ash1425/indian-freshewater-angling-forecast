# Fishing Forecast India

A React-based web application that provides fishing condition forecasts for freshwater anglers in India. The app analyzes weather data to calculate optimal fishing conditions and helps anglers plan their fishing trips.

## What It Does

- **Weather Analysis**: Fetches current and forecasted weather data for fishing locations across India
- **Fishing Forecast**: Calculates fishing conditions based on multiple factors including:
  - Barometric pressure trends
  - Temperature and humidity
  - Moon phase
  - Wind conditions
  - Sunrise/sunset times
- **Species Selection**: Supports multiple fish species commonly targeted in Indian freshwater:
  - Indian Major Carps (Rohu, Catla, Mrigal)
  - Other Carps
  - Catfish
  - Murrel
- **Hourly Breakdown**: Provides hour-by-hour fishing forecasts for the selected day
- **Location Detection**: Auto-detects user location or allows URL-based location sharing via `?lat=X&lon=Y`

## Tech Stack

- React 19 with TypeScript
- Vite for build tooling
- Babel React Compiler
- Vitest for testing
- CSS Modules

## Getting Started

```bash
pnpm install
pnpm dev
```

## Build & Test

```bash
pnpm build        # Type check + build
pnpm lint         # Run ESLint
pnpm vitest run   # Run tests
```
