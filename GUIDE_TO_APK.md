# 📱 Mobile App Generation Guide

Follow these steps to convert your React app into a mobile app.

## 1. Initial Setup (Generate Folders)
**Run this once** to create the `android` and `ios` folders.

```bash
npm run mobile:init
```

*   If this fails with "Android/iOS platform already exists", it means you've done this before. You can skip to Step 2.

## 2. Build Android APK
**Run this to build the installation file.**

1.  Run command:
    ```bash
    npm run build:apk
    ```
    *This will build your web code and open Android Studio.*

2.  **Inside Android Studio:**
    *   Wait for indexing (bottom right progress bars) to finish.
    *   Click **Build** (Top Menu) > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    *   When finished, click **"locate"** in the popup to find your `.apk` file.

## 3. Build for iOS (Mac Only)
1.  Run command:
    ```bash
    npm run open:ios
    ```
2.  **Inside Xcode:**
    *   Select your "Team" in the **Signing & Capabilities** tab.
    *   Press the **Play** (▶️) button to run on your connected iPhone.

## 4. Updating Your App
After you make changes to your code (e.g., editing `Dashboard.tsx`), you don't need to regenerate folders. Just run:

```bash
npm run mobile:update
```

This will:
1.  Rebuild your React code.
2.  Sync the changes to the `android` and `ios` folders.
3.  You can then press "Run" in Android Studio/Xcode again.
