import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export const WebMapView = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // OpenStreetMap kullanarak web haritası
  useEffect(() => {
    if (!mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [mapLoaded, userLocation, restaurants]);

  const initializeMap = () => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    // Leaflet CSS ve JS yükleme
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.onload = () => {
      createMap();
    };
    document.head.appendChild(leafletJS);
  };

  const createMap = () => {
    const centerLat = userLocation?.latitude;
    const centerLng = userLocation?.longitude;

    // Harita oluştur
    const map = window.L.map(mapRef.current).setView([centerLat, centerLng], 16);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 10
    }).addTo(map);

    // Konum Markerı
    if (userLocation) {
      const userIcon = window.L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(66,133,244,0.6);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
      
      window.L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(map);
    }


    const restaurantMarkers = [];

    // Restoran marker'larını oluştur
    const createRestaurantMarkers = (showLabels = true) => {
      restaurantMarkers.forEach(marker => map.removeLayer(marker));
      restaurantMarkers.length = 0;

      restaurants.forEach((restaurant) => {
        const restaurantIcon = window.L.divIcon({
          className: 'restaurant-marker',
          html: `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background: #EA4335; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4);">
                <span style="color: white; font-size: 14px;">🍽️</span>
              </div>
              <div style="
                background: rgba(0,0,0,0.8); 
                color: white; 
                padding: 4px 8px; 
                border-radius: 6px; 
                font-size: 11px; 
                white-space: nowrap; 
                max-width: 120px; 
                text-align: center; 
                font-weight: 500; 
                margin-top: 2px;
                text-overflow: ellipsis;
                overflow: hidden;
                display: ${showLabels ? 'block' : 'none'};
              ">
                ${restaurant.name}
              </div>
            </div>
          `,
          iconSize: [140, 60],
          iconAnchor: [70, 32]
        });

        const marker = window.L.marker([restaurant.coordinate.latitude, restaurant.coordinate.longitude], { icon: restaurantIcon })
          .addTo(map)
          .on('click', () => {
            if (onMarkerPress) {
              onMarkerPress(restaurant);
            }
          });

        restaurantMarkers.push(marker);
      });
    };

    // İlk marker'ları oluştur
    createRestaurantMarkers(map.getZoom() >= 15);

    // Zoom değiştiğinde marker'ları güncelle
    map.on('zoomend', () => {
      const currentZoom = map.getZoom();
      const showLabels = currentZoom >= 15;
      createRestaurantMarkers(showLabels);
    });

    setMapLoaded(true);
  };

  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMapView}>
    
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden'
          }}
        />
        
        {!mapLoaded && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f5f5f5',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 12
          }}>
            <Text style={{ color: '#666', fontSize: 16 }}>Harita yükleniyor...</Text>
          </View>
        )}
      </View>
    </View>
  );
};