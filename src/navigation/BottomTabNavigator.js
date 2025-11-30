import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen/HomeScreen';
import MapScreen from '../screens/MapScreen/MapScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';

const Tab = createBottomTabNavigator();

const createShadowStyle = (elevation) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0 ${elevation * 0.5}px ${elevation * 1}px '#41006fff'`,
    };
  }
  return {
    elevation,
    shadowColor: '#41006fff',
    shadowOffset: {
      width: 0,
      height: elevation * 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: elevation * 0.8,
  };
};

const TabIcon = ({ name, focused }) => {
  const { theme } = useTheme();
  let iconName;
  let iconColor = focused ? theme.colors.primary : theme.colors.textTertiary;

  switch (name) {
    case 'Map':
      iconName = 'map';
      break;
    case 'Home':
      iconName = 'map-marker';
      break;
    case 'Profile':
      iconName = 'user';
      break;
    default:
      iconName = 'question';
  }

  return (
    <View style={[styles.tabIconContainer, focused && { backgroundColor: theme.colors.primary + '20' }]}>
      <FontAwesome 
        name={iconName} 
        size={24} 
        color={iconColor}
        style={{ opacity: focused ? 1 : 0.6 }}
      />
    </View>
  );
};

const TabLabel = ({ label, focused }) => {
  const { theme } = useTheme();
  return (
    <Text style={[
      styles.tabLabel,
      { 
        color: focused ? theme.colors.primary : theme.colors.textTertiary,
        opacity: focused ? 1 : 0.7,
        fontWeight: focused ? '600' : '400'
      }
    ]}>
      {label}
    </Text>
  );
};

export default function BottomTabNavigator() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          backgroundColor: theme.isDarkMode ? theme.colors.background : theme.colors.card,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarBackground: () => null,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Harita" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon name="Map" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Mekanlar" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon name="Home" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel label="Profil" focused={focused} />,
          tabBarIcon: ({ focused }) => <TabIcon name="Profile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 50,
    height: Platform.OS === 'ios' ? 90 : 80,
    paddingBottom: Platform.OS === 'ios' ? 25 : 12.5,
    paddingTop: 8,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    ...createShadowStyle(10),
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 25,
    borderRadius: 20,
    position: 'relative',
    marginBottom: 2,
  },
  focusedTabContainer: {
    transform: [{ scale: 1.05 }],
  },
  tabIcon: {
    fontSize: 25,
  },
  tabLabel: {
    fontSize: 12.5,
    fontWeight: '1000',
    marginTop: 3,
  },
});