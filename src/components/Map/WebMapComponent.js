import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export const WebMapComponent = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMapView}>
        <View style={styles.mapBackground}>

          {[...Array(10)].map((_, i) => (
            <View key={`h${i}`} style={[styles.gridLine, { 
              top: `${i * 10}%`, 
              left: 0, 
              right: 0, 
              height: 1 
            }]} />
          ))}
          {[...Array(8)].map((_, i) => (
            <View key={`v${i}`} style={[styles.gridLine, { 
              left: `${i * 12.5}%`, 
              top: 0, 
              bottom: 0, 
              width: 1 
            }]} />
          ))}
          
          <View style={[styles.webUserLocation, { top: '50%', left: '50%' }]}>
            <View style={styles.webUserDot}>
              <View style={styles.webUserInner} />
            </View>
          </View>
          
          {restaurants.slice(0, 5).map((restaurant, index) => {
            const positions = [
              { top: '30%', left: '35%' },
              { top: '40%', left: '65%' },
              { top: '65%', left: '45%' },
              { top: '25%', left: '70%' },
              { top: '70%', left: '25%' }
            ];
            
            return (
              <View key={restaurant.id} style={[styles.webRestaurantContainer, positions[index]]}>
                <TouchableOpacity 
                  style={styles.webRestaurantPin}
                  onPress={() => onMarkerPress(restaurant)}
                >
                  <View style={styles.webPinHead}>
                    <Text style={styles.webPinIcon}>🍽️</Text>
                  </View>
                  <View style={styles.webPinPoint} />
                </TouchableOpacity>
                <View style={styles.webMarkerLabel}>
                  <Text style={styles.webMarkerLabelText}>{restaurant.name}</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        <View style={styles.webMapControls}>
          <TouchableOpacity style={styles.webZoomButton}>
            <Text style={styles.webZoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.webZoomButton}>
            <Text style={styles.webZoomText}>-</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.webCompass}>
          <Text style={styles.webCompassText}>N</Text>
        </View>
      </View>
    </View>
  );
};