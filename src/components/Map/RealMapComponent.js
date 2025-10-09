import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

// Expo Maps import'u
let ExpoMap, ExpoMarker;
try {
  const ExpoMaps = require('expo-maps');
  ExpoMap = ExpoMaps.default;
  ExpoMarker = ExpoMaps.Marker;
} catch (error) {
  console.warn('expo-maps yüklenemedi:', error);
  ExpoMap = null;
  ExpoMarker = null;
}

export const RealMapComponent = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  if (!ExpoMap) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Harita yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <ExpoMap
        style={styles.realMap}
        initialRegion={region}
        provider="google"
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
        mapType="standard"
      >
        {userLocation && (
          <ExpoMarker
            coordinate={userLocation}
            title="Konumunuz"
            description="Şu anki konumunuz"
            pinColor="blue"
          />
        )}
        
        {restaurants.map((restaurant) => (
          <ExpoMarker
            key={restaurant.id}
            coordinate={restaurant.coordinate}
            onPress={() => onMarkerPress(restaurant)}
          >
            <View style={styles.customMarkerContainer}>
              <View style={styles.customMarker}>
                <View style={styles.markerContainer}>
                  <Text style={styles.markerEmoji}>🍽️</Text>
                </View>
                <View style={styles.markerTriangle} />
              </View>
              <View style={styles.markerLabel}>
                <Text style={styles.markerLabelText}>{restaurant.name}</Text>
              </View>
            </View>
          </ExpoMarker>
        ))}
      </ExpoMap>
    </View>
  );
};