import React, { useState, useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LocationProvider } from './src/context/LocationContext';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './src/screens/CustomSplashScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Uygulamanın hazır olmasını bekle
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const handleSplashFinish = async () => {
    setIsSplashVisible(false);
    await SplashScreen.hideAsync();
  };

  if (!appIsReady || isSplashVisible) {
    return <CustomSplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <AppNavigator />
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
