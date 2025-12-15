# TBH Beekeeper

An offline-first beekeeping management application for top-bar hives, built with React Native (Android) and Next.js (web).

## Project Structure

```
tbh-beekeeper/
├── apps/
│   ├── mobile/          # React Native (Expo) Android app
│   └── web/             # Next.js web application
├── packages/
│   └── shared/          # Shared TypeScript models, utilities, sync logic
├── turbo.json           # Turborepo configuration
└── package.json         # Root package.json with workspaces
```

## Tech Stack

- **Monorepo:** Turborepo
- **Mobile:** React Native with Expo
- **Web:** Next.js (React)
- **Local Storage:** WatermelonDB (offline-first)
- **Backend:** Supabase (auth + sync)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- For mobile development: Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Run both mobile and web in dev mode
npm run dev

# Or run individually
npm run mobile
npm run web
```

### Development

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Lint code
npm run lint
```

## Features

- **Hive-centric management** - Focus on individual top-bar hives
- **Bar-by-bar status tracking** - Interactive visualization of all 30 bars
- **Offline-first** - Works without internet, syncs when online
- **Inspections & Interventions** - Track queen status, brood patterns, treatments
- **Weather integration** - 14-day forecast with inspection suitability scoring
- **Task management** - Hive and apiary-level tasks with smart consolidated views
- **Multi-user support** - Data isolation and apiary sharing

## License

Private - All rights reserved
