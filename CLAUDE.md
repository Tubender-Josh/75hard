# 75 Hard Native App

## Project Overview
React Native (Expo) rewrite of the 75 Hard tracking web app. Personal use only — not published to App Store.

## Key Facts
- **Expo SDK:** 54.0.0 (Expo Go on iPhone is SDK 54 — do NOT upgrade SDK without checking Expo Go version first)
- **React Native:** 0.81.5
- **React:** 19.1.0
- **Node.js required:** v20.19.4+ (user has v20.13.1 — causes warnings but works for now)

## How to Run (Dev)
```
cd C:\Users\joshu\75hard-app
npx expo start --clear
```
- Port 8081 is often taken — use `--port 8083` or higher if needed
- User scans QR code with iPhone camera → opens in Expo Go app
- Camera feature (task 3) does NOT work in Expo Go — requires a full EAS build

## Installing npm packages
Always use `--legacy-peer-deps`:
```
npm install <package> --legacy-peer-deps
```

## Project Structure
```
App.js                  — Root component, loads state, renders tabs
src/constants.js        — 7 tasks list + color palette
src/storage.js          — AsyncStorage read/write (key: 75hard_v2)
src/migrationData.js    — Pre-populated history from original web app
src/dateUtils.js        — Date helper functions
src/TodayScreen.js      — Daily task checklist + camera button
src/ProgressScreen.js   — Calendar view + streak stats
src/DayDetailModal.js   — Popup showing tasks for a tapped day
```

## The 7 Tasks
1. 🏋️ 45 minute workout
2. 🌳 45 minute outdoor workout
3. 📸 Take progress picture (hasCamera: true — triggers camera on tap)
4. 📖 Read 10 pages
5. 💧 Drink 1 gallon of water
6. 🥗 Follow a diet
7. 🚫 No cheat meals or alcohol

## Data Storage
- All data stored locally on iPhone via AsyncStorage
- Key: `75hard_v2`
- Structure: `{ startDate: 'YYYY-MM-DD', days: { 'YYYY-MM-DD': { tasks: [bool x7], photo: uri|null } } }`
- Photos saved to `FileSystem.documentDirectory + 'photo_YYYY-MM-DD.jpg'`
- Start date: 2026-05-13 (Day 1), migration data covers Days 1–42

## GitHub
- Repo: https://github.com/Tubender-Josh/75hard (PRIVATE)
- Web app (old): `main` branch
- Native app (this project): `native-app` branch
- Push: `git push origin native-app`

## EAS Build (iOS)
- Expo account: baumjoshua78
- EAS project: baumjoshua78/75hard-app (ID: af7810e3-19df-4549-8e90-c3e066575751)
- Bundle ID: com.joshua.75hard
- Build profile to use: `preview` (internal distribution, no App Store)
- Login: `npx eas-cli login`
- Build command: `npx eas-cli build --platform ios --profile preview`
- Apple Developer account: belongs to user's friend (not the user) — friend must provide credentials when EAS prompts for Apple ID

## Pending — What's Left To Do
1. Register iPhone as a device: `npx eas-cli device:create` (needs friend's Apple ID)
2. Run EAS build: `npx eas-cli build --platform ios --profile preview` (needs friend's Apple ID + 2FA)
3. Friend registers device UDID in their Apple Developer account
4. Install the .ipa on iPhone via the EAS-generated link/QR code
5. Test camera feature (progress photo) in the real build

## Known Issues / Notes
- SafeAreaView uses `react-native-safe-area-context` (not the deprecated RN built-in)
- EBADENGINE warnings on install are harmless — caused by Node v20.13.1 being slightly old
- Camera/photo feature cannot be tested in Expo Go — only works in a full native build
