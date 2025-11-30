import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import RestaurantDetailScreen from '../screens/RestaurantScreen/RestaurantDetailsScreen';
import ReservationScreen from '../screens/ReservationsScreen/ReservationScreen/ReservationScreen';
import ReservationDetailsScreen from '../screens/ReservationsScreen/ReservationDetailsScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import AccountInfoScreen from '../screens/ProfileScreen/AccountInfoScreen';
import FavoriteRestaurantsScreen from '../screens/ProfileScreen/FavoriteRestaurantsScreen';
import NotificationSettingsScreen from '../screens/ProfileScreen/NotificationSettingsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoggedIn, isLoading } = useAuth();
  
  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
            <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
            <Stack.Screen name="Reservation" component={ReservationScreen} />
            <Stack.Screen name="ReservationDetails" component={ReservationDetailsScreen} />
            <Stack.Screen name="Reservations" component={ReservationsScreen} />
            <Stack.Screen name="AccountInfo" component={AccountInfoScreen} />
            <Stack.Screen name="FavoriteRestaurants" component={FavoriteRestaurantsScreen} />
            <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
