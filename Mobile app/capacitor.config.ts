import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mulasense.app',
  appName: 'MulaSense',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#2D358B',
      showSpinner: false,
    },
    UssdPlugin: {
      enabled: true,
    },
  },
};

export default config;
