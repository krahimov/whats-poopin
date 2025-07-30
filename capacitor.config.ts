import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whatspoopin.app',
  appName: "What's Poopin",
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Use live web app for API calls
    url: 'https://whats-poopin-git-dev-karim-rahimovs-projects.vercel.app',
    cleartext: true
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
    }
  }
};

export default config;
