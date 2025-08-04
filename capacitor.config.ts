import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.02e35dc1cb6349da89b13d7b779a9d66',
  appName: 'super-test-force',
  webDir: 'dist',
  server: {
    url: 'https://02e35dc1-cb63-49da-89b1-3d7b779a9d66.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;