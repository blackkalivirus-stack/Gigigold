# PMJ DigiGold - APK Generation Guide

## 1. One-Time Setup
Ensure you have **Android Studio** and **Java JDK 17** installed.

## 2. Build Commands (VS Code Terminal)
Run these commands every time you update your code:

1. `npm install` (Only if you added new packages)
2. `npm run build` (Compiles your React code)
3. `npx cap sync` (Copies the build to the Android project)

## 3. Generate APK (Android Studio)
1. Run `npx cap open android` to open the studio.
2. Wait for Gradle Sync to finish.
3. Click **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
4. Click **"locate"** in the notification bubble to find your file.

## Important Note
This app currently uses a CDN for styling. **Your phone must have an internet connection** when you open the app, otherwise the styles (Tailwind CSS) will not load.
