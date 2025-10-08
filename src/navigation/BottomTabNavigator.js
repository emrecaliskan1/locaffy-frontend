import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, Platform } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const createShadowStyle = (elevation) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `0 ${elevation * 0.5}px ${elevation * 1}px rgba(0, 0, 0, 0.15)`,
    };
  }
  return {
    elevation,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: elevation * 0.5,
    },
    shadowOpacity: 0.15,
    shadowRadius: elevation * 0.8,
  };
};

const TabIcon = ({ name, focused }) => {
  let iconName;
  let iconColor = focused ? '#FF6B35' : '#95A5A6';

  switch (name) {
    case 'Map':
      iconName = '🗺️';
      break;
    case 'Home':
      iconName = '🍽️';
      break;
    case 'Profile':
      iconName = '👤';
      break;
    default:
      iconName = '❓';
  }

  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, { color: iconColor }]}>{iconName}</Text>
    </View>
  );
};

const TabLabel = ({ label, focused }) => {
  return (
    <Text style={[
      styles.tabLabel,
      { color: focused ? '#FF6B35' : '#95A5A6' }
    ]}>
      {label}
    </Text>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#95A5A6',
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
    bottom: -5,
    left: 0,
    right: 0,
    elevation: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingTop: 10,
    paddingHorizontal: 20,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    ...createShadowStyle(8),
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    fontSize: 24,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 0,
  },
});