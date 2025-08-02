import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whatspoopin.app',
  appName: "What's Poopin",
  webDir: 'out', // Keep this for fallback
  server: {
    // Load the live web app directly
    url: 'https://whats-poopin-git-dev-karim-rahimovs-projects.vercel.app',
    cleartext: true,
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#3b82f6",
    },
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    // Add status bar configuration for better mobile experience
    StatusBar: {
      backgroundColor: "#3b82f6",
      style: "dark"
    }
  }
};

export default config;
