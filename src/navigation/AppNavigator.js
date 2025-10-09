import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import RestaurantDetailScreen from '../screens/RestaurantSceen/RestaurantDetailsScreen/RestaurantDetailScreen';
import ReservationScreen from '../screens/ReservationsScreen/ReservationScreen';
import ReservationDetailsScreen from '../screens/ReservationsScreen/ReservationDetailsScreen/ReservationDetailsScreen';
import MenuScreen from '../screens/MenuScreen/MenuScreen';
import CartScreen from '../screens/CartScreen/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import OrderConfirmationScreen from '../screens/OrdersScreen/OrderConfirmationScreen/OrderConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={BottomTabNavigator} />
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
