# How to Generate the APK

## Prerequisites
1.  **Node.js** installed.
2.  **Android Studio** installed (Required to compile the final APK).

## Using VS Code Tasks (Recommended)
We have added automated tasks to VS Code.

1.  Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2.  Type **"Run Task"** and press Enter.
3.  Select **"1. Initialize Android Platform"**.
    *   *Do this only the first time. It creates the missing `android` folder.*
4.  Select **"2. Sync & Open Android Studio"**.
    *   *Do this every time you change your code.*

## Generating the APK File
Once **Android Studio** opens via the command above:

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
    *   This app uses Tailwind via CDN for styling. Ensure your phone has an internet connection, or configure Tailwind locally for offline support.
