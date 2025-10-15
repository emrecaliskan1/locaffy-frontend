import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export const WebMapComponent = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 50, y: 50 });

  // Google Maps benzeri görsel harita için background image veya embed kullanabiliriz
  const renderGoogleMapsEmbed = () => {
    const centerLat = region?.latitude || 41.6771;
    const centerLng = region?.longitude || 26.5557;
    
    return (
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 12,
        }}
        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12000!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1str!2str!4v1635000000000!5m2!1str!2str`}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  };

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMapView}>
        {/* Google Maps Embed */}
        <View style={styles.mapBackground}>
          {renderGoogleMapsEmbed()}
          
          {/* Overlay ile restoran marker'ları */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'box-none',
          }}>
            {/* Kullanıcı konumu */}
            {userLocation && (
              <View style={[styles.webUserLocation, { 
                top: '50%', 
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }]}>
                <View style={styles.webUserDot}>
                  <View style={styles.webUserInner} />
                </View>
                <Text style={styles.webUserLabel}>Konumunuz</Text>
              </View>
            )}
            
            {/* Restoran marker'ları */}
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
        </View>
        
        {/* Harita kontrolleri */}
        <View style={styles.webMapControls}>
          <TouchableOpacity 
            style={styles.webControlButton}
            onPress={() => {
              if (userLocation) {
                setCenter({ x: 50, y: 50 });
              }
            }}
          >
            <Text style={styles.webControlIcon}>📍</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.webZoomButton}
            onPress={() => setZoom(Math.min(zoom + 0.2, 3))}
          >
            <Text style={styles.webZoomText}>+</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.webZoomButton}
            onPress={() => setZoom(Math.max(zoom - 0.2, 0.5))}
          >
            <Text style={styles.webZoomText}>-</Text>
          </TouchableOpacity>
        </View>
        
        {/* Pusula */}
        <View style={styles.webCompass}>
          <Text style={styles.webCompassText}>N</Text>
        </View>
        
        {/* Harita türü değiştirici */}
        <View style={styles.webMapTypeSelector}>
          <TouchableOpacity style={styles.webMapTypeButton}>
            <Text style={styles.webMapTypeText}>Harita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.webMapTypeButton}>
            <Text style={styles.webMapTypeText}>Uydu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};