# MeTracker

MeTracker is a React Native (Expo) application for personal health and habit tracking. It ships with a set of prebuilt trackers (e.g. caffeine intake and toilet logs) and lets you create fully custom trackers (including substance trackers with decay visualization). Data is stored locally using SQLite for privacy and offline reliability.

## Key Features

### 1. Prebuilt Trackers
- Caffeine tracker with intake logging and real‑time decay graph:
  - UI + list: [`app/caffeine/logs.tsx`](app/caffeine/logs.tsx)
  - Decay visualization: [`SubstanceDecayGraph`](components/SubstanceDecayGraph.tsx)
  - Intake list items: [`SubstanceLogCard`](components/SubstanceLogCard.tsx)
  - Data hook: [`useIntakes`](hooks/useIntakes.ts)
- Toilet log tracker (urination & bowel movement details):
  - Log list: [`app/toilet/logs.tsx`](app/toilet/logs.tsx)
  - Add form: [`app/toilet/add.tsx`](app/toilet/add.tsx)
  - Detail view & deletion: [`app/toilet/details.tsx`](app/toilet/details.tsx)

### 2. Custom Trackers
Create arbitrary trackers with fields (number, boolean, text, select, image):
- Creation UI & persistence: [`app/createTracker/createMenu.tsx`](app/createTracker/createMenu.tsx)
- Custom tracker screen (dynamic rendering + filtering): [`app/customTrackers/[name].tsx`](app/customTrackers/[name].tsx)
- Log cards with swipe‑to‑delete: [`CustomtTrackerLogCard`](components/CustomtTrackerLogCard.tsx)
- Tracker settings & deletion: [`app/customTrackers/settings/[name].tsx`](app/customTrackers/settings/[name].tsx)

### 3. Substance Trackers (Custom)
Any custom tracker can be marked as a “substance tracker” to:
- Store unit & half‑life metadata
- Plot estimated active amount over time with decay curve
- Screen: [`app/customTrackers/substance/[name].tsx`](app/customTrackers/substance/[name].tsx)
- Graph engine: [`SubstanceDecayGraph`](components/SubstanceDecayGraph.tsx)

### 4. Local SQLite Storage
All persistence is local (offline-first):
- Tables created lazily per tracker (e.g. `${name}_intakes`, `tracker_<id>`, `toilet`)
- Examples: [`useIntakes`](hooks/useIntakes.ts), [`app/toilet/logs.tsx`](app/toilet/logs.tsx), [`app/createTracker/createMenu.tsx`](app/createTracker/createMenu.tsx)

### 5. Theming (Light / Dark)
- Central theme context & provider consumed throughout:
  - Usage examples: [`app/index.tsx`](app/index.tsx), [`app/_layout.tsx`](app/_layout.tsx), [`constants/Colors.ts`](constants/Colors.ts)

### 6. PIN Lock (Simple Local Auth)
- PIN setup & verification stored securely:
  - Component: [`SignIn`](components/SignIn.tsx)
  - Settings integration: [`app/settings.tsx`](app/settings.tsx)

### 7. Reusable UI Components
- Floating action button: [`FloatingPlusButton`](components/FloatingPlusButton.tsx)
- Input helpers: [`NumberField`](components/NumberField.tsx), image selector (`ImageField`), select fields, etc.
- Generic swipeable card: [`Card`](components/Card.tsx)
- Themed wrappers: `ThemedText`, `ThemedView` (used across screens)

### 8. Toast Feedback
Consistent success/error feedback via `react-native-toast-message` (e.g. deletions & saves in tracker and toilet flows).

### 9. Data Visualization
- Smoothly animated decay curve using Skia + Reanimated in [`SubstanceDecayGraph`](components/SubstanceDecayGraph.tsx)

## High-Level Architecture

| Layer | Responsibility |
|-------|----------------|
| Screens (`app/*`) | Navigation targets & feature composition |
| Components (`components/*`) | Reusable presentation & interaction units |
| Hooks (`hooks/*`) | Data fetching & derived state (e.g. [`useIntakes`](hooks/useIntakes.ts)) |
| Theme (`constants/Colors.ts`) | Color tokens (light/dark) |
| SQLite Access | Direct lightweight queries per feature (no heavy ORM) |

## Data Model Examples

- Caffeine intakes: `caffeine_intakes (id, name, time, amount)`
- Substance trackers: `<substance>_intakes`
- Custom trackers: `tracker_<trackerID>` plus metadata in `trackers`
- Toilet logs: `toilet (time, urination, urinationColor, isPainUrination, isBM, BMColor, BMshape, isPainBM, isSmell, photo, notes)`

## Navigation

Expo Router file-based navigation:
- Root layout: [`app/_layout.tsx`](app/_layout.tsx)
- Section layouts (e.g. toilet stack): [`app/toilet/_layout.tsx`](app/toilet/_layout.tsx)

## Getting Started

### Prerequisites
- Node.js (LTS)
- Expo CLI (`npx expo` will scaffold)
- iOS Simulator / Android Emulator / Expo Go

### Install
```bash
npm install
```

### Run (Development)
```bash
npx expo start
```
Select a platform (press `i` for iOS simulator, `a` for Android, or scan the QR code).

### Build (Example)
```bash
# Example: Prebuild native project (if needed)
npx expo prebuild
```

## Typical Workflow

1. Open app – authenticate via PIN if set (`SignIn`)
2. View dashboard of prebuilt + custom trackers [`app/index.tsx`](app/index.tsx)
3. Add data (e.g. caffeine intake or toilet log) via floating button [`FloatingPlusButton`](components/FloatingPlusButton.tsx)
4. For substance trackers, observe decay curve [`SubstanceDecayGraph`](components/SubstanceDecayGraph.tsx)
5. Create new tracker with fields in creation UI [`app/createTracker/createMenu.tsx`](app/createTracker/createMenu.tsx)
6. Manage tracker (delete or review) in settings [`app/customTrackers/settings/[name].tsx`](app/customTrackers/settings/[name].tsx)

## Deleting & Editing
- Swipe cards (custom logs & intakes) to trigger delete confirmations (see [`SubstanceLogCard`](components/SubstanceLogCard.tsx), [`CustomtTrackerLogCard`](components/CustomtTrackerLogCard.tsx))
- Full log deletion for toilet entries from details page (`Delete Log` action)

## Theming
All screens read current theme from context and apply palette defined in [`constants/Colors.ts`](constants/Colors.ts).

## Security / Privacy
- All data is local (SQLite)
- PIN stored via SecureStore (see usage inside [`SignIn`](components/SignIn.tsx))

## Roadmap Ideas
- Data export (CSV / JSON)
- Charts for non-substance trackers
- Cloud sync (optional)
- Field editing after tracker creation
- Accessibility & localization improvements

## Contributing
1. Fork / branch
2. Implement change
3. Test on at least one platform
4. Submit PR

---
Built to help individuals observe patterns in daily health metrics with full local ownership of their data.

# Demo
1. Install Expo Go on your mobile device.
2. Enter the following URL in Expo Go to load the app: 