# How to Generate Mobile Apps (APK & iOS)

## Prerequisites
1.  **Node.js** installed.
2.  **Android Studio** installed (for Android APKs).
3.  **Xcode** installed (for iOS Apps - Mac only).

## Method 1: Using VS Code Tasks (Recommended)
We have added automated tasks to VS Code to make this easy.

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Type **"Run Task"** and press Enter.
3.  Select **"1. Initialize Mobile Platforms (Android & iOS)"**.
    *   *Do this only the first time. It creates the missing `android` and `ios` folders.*
4.  Select **"2. Open Android Studio"** or **"3. Open Xcode"**.
    *   *Do this every time you change your code to sync updates.*

## Method 2: Using Terminal
You can also run these commands directly in the VS Code terminal:

*   **Initialize Folders:** `npm run mobile:init`
*   **Open Android:** `npm run open:android`
*   **Open iOS:** `npm run open:ios`

## generating the APK File (Android Studio)
Once **Android Studio** opens:

1.  Wait for the project to index (look at the bottom right loading bars).
2.  In the top menu bar, click **Build**.
3.  Select **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4.  When finished, a notification will appear in the bottom right corner.
5.  Click the **"locate"** link in that notification to find your `.apk` file.

## Troubleshooting

*   **"npx cap add android" fails?**
    *   Make sure you have run `npm install` first.
    *   Ensure the `dist` folder exists (run `npm run build`).

*   **App looks different on phone?**
    *   This app uses Tailwind via CDN for styling. Ensure your phone has an internet connection.
