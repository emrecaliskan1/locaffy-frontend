import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../Auth/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import RestaurantDetailScreen from '../Restaurant/RestaurantDetailScreen';
import ReservationScreen from '../Restaurant/ReservationScreen';
import ReservationDetailsScreen from '../Restaurant/ReservationDetailsScreen';
import MenuScreen from '../Restaurant/MenuScreen';
import CartScreen from '../Restaurant/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import OrderConfirmationScreen from '../Restaurant/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        <Stack.Screen name="Reservation" component={ReservationScreen} />
  <Stack.Screen name="ReservationDetails" component={ReservationDetailsScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
  <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="Reservations" component={ReservationsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
