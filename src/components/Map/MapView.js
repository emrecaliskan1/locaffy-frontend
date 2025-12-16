import React from 'react';
import { View, Platform } from 'react-native';
import { WebMapView } from './WebMapView';
import { MobileMapView } from './MobileMapView';
import { DraggableBottomSheet } from './DraggableBottomSheet';

export const ModernMapView = ({ restaurants, onMarkerPress, userLocation, region, styles, onBottomSheetToggle }) => {
  
  if (Platform.OS === 'web') {
    return (
      <View style={styles.mapContainer}>
        <WebMapView
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
          onToggle={onBottomSheetToggle}
          userLocation={userLocation}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.mapContainer}>
        <MobileMapView
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
          onToggle={onBottomSheetToggle}
          userLocation={userLocation}
        />
      </View>
    );
  }
};