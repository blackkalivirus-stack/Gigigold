# 📱 Mobile App Build Guide (Android & iOS)

This project uses **Capacitor** to wrap the React web app into native mobile apps.

---

## 🚀 Phase 1: Initialization (First Time Only)
Before you can build the app, you need to generate the native project folders.

1.  Open your terminal.
2.  Run the initialization script:
    ```bash
    npm run mobile:init
    ```
    ✅ **Success:** You will see new `android` and `ios` folders appear in your file explorer.

---

## 🤖 Phase 2: Building for Android (APK)

### Prerequisites
*   Download & Install [Android Studio](https://developer.android.com/studio).

### Steps
1.  **Sync your code:**
    Every time you change your React code, run this before building:
    ```bash
    npm run sync
    ```

2.  **Open Project:**
    ```bash
    npm run open:android
    ```

3.  **Build APK:**
    *   Wait for Android Studio to finish indexing (bottom right bar).
    *   Go to **Build** menu > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
    *   *Wait for the build to finish.*

4.  **Install:**
    *   A notification will appear in the bottom right: *"APK(s) generated successfully"*.
    *   Click **"locate"**.
    *   Transfer the `.apk` file to your phone (via USB, WhatsApp, Drive, etc.) and install it.

---

## 🍎 Phase 3: Building for iOS (iPhone/iPad)

### Prerequisites
*   You must be on a **Mac**.
*   Download & Install [Xcode](https://developer.apple.com/xcode/) from the App Store.
*   You need an Apple ID.

### Steps
1.  **Sync your code:**
    ```bash
    npm run sync
    ```

2.  **Open Project:**
    ```bash
    npm run open:ios
    ```

3.  **Setup Signing (One time):**
    *   In Xcode, click **"App"** in the left sidebar (the blue icon at the top).
    *   Click the **"Signing & Capabilities"** tab in the main view.
    *   Under **"Team"**, select your Apple ID (Add Account if needed).
    *   Ensure **"Bundle Identifier"** is unique (e.g., `com.yourname.digigold`).

4.  **Run on Device:**
    *   Connect your iPhone to your Mac via USB.
    *   In the top bar, select your iPhone from the device list.
    *   Click the **Play (▶️)** button.

---

## 🛠 Troubleshooting

**1. "Android folder already exists" Error**
If you run `mobile:init` twice, it might fail. If you need to regenerate folders entirely:
1.  Delete the `android` or `ios` folder manually.
2.  Run `npm run mobile:init` again.

**2. Styles look broken on the phone?**
This app uses TailwindCSS via CDN for the preview. For production mobile apps, **ensure your phone has internet access** or configure Tailwind to compile locally (already set up in this project via `postcss`).

**3. "SDK Location not found"**
Open Android Studio, go to **Settings > Languages & Frameworks > Android SDK**, and copy the Android SDK Location path to your `local.properties` file if prompted.
