import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pmjjewels.digigold',
  appName: 'PMJ DigiGold',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Ensure we don't try to load from a live server in production
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      overlay: true, // Make status bar transparent over the app
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#E5E0D8", // Updated to match App Theme (Beige/Gold)
      showSpinner: false,
      androidScaleType: "CENTER_CROP",
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;