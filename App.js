import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { LocationProvider } from './src/context/LocationContext';

export default function App() {
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
