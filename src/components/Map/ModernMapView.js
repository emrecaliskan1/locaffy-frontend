import React from 'react';
import { View, Platform } from 'react-native';
import { WebMapComponent } from './WebMapComponent';
import { RealMapComponent } from './RealMapComponent';
import { DraggableBottomSheet } from './DraggableBottomSheet';

export const ModernMapView = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  if (Platform.OS === 'web') {
    // Web'de fallback harita kullan
    return (
      <View style={styles.mapContainer}>
        <WebMapComponent
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
          userLocation={userLocation}
          region={region}
          styles={styles}
        />
        
        <DraggableBottomSheet 
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
          styles={styles}
        />
      </View>
    );
  } else {
    // Native'de gerçek harita kullan
    return (
      <View style={styles.mapContainer}>
        <RealMapComponent
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
          userLocation={userLocation}
          region={region}
          styles={styles}
        />
        
        <DraggableBottomSheet 
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
          styles={styles}
        />
      </View>
    );
  }
};