import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getRestaurantIconForHTML } from '../../utils/restaurantIcons';
import { useTheme } from '../../context/ThemeContext';

export const WebMapView = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { theme } = useTheme();

  // OpenStreetMap kullanarak web haritası
  useEffect(() => {
    if (!mapLoaded && mapRef.current) {
      initializeMap();
    }
  }, [mapLoaded]);

  // Theme değiştiğinde haritayı güncelle
  useEffect(() => {
    if (mapLoaded && window.map) {
      updateMapTheme();
    }
  }, [theme.isDarkMode]);

  // Restaurants verisi degistiginde marker'ları güncelle
  useEffect(() => {
    if (mapLoaded && window.map && restaurants) {
      setTimeout(() => {
        if (window.updateMapMarkers) {
          window.updateMapMarkers(restaurants);
        }
      }, 100);
    }
  }, [restaurants, mapLoaded]);

  const initializeMap = () => {
    const mapElement = mapRef.current;
    if (!mapElement) return;

    // Leaflet zaten yüklü mü kontrol et
    if (window.L) {
      createMap();
      return;
    }

    // Leaflet CSS ve JS yükleme (sadece bir kere)
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(leafletCSS);
    }

    // FontAwesome CSS yükleme
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeCSS = document.createElement('link');
      fontAwesomeCSS.rel = 'stylesheet';
      fontAwesomeCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
      document.head.appendChild(fontAwesomeCSS);
    }

    if (!document.querySelector('script[src*="leaflet.js"]')) {
      const leafletJS = document.createElement('script');
      leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      leafletJS.onload = () => {
        createMap();
      };
      document.head.appendChild(leafletJS);
    }
  };

  const updateMapTheme = () => {
    console.log('updateMapTheme called, theme.isDarkMode:', theme.isDarkMode);
    if (!window.map || !window.L) {
      console.log('Map or Leaflet not available');
      return;
    }

    // Harita container'ı al ve CSS class ekle/kaldır
    const mapContainer = window.map.getContainer();
    if (theme.isDarkMode) {
      mapContainer.classList.add('apple-dark-map');
    } else {
      mapContainer.classList.remove('apple-dark-map');
    }
  };

  const createMap = () => {
    const centerLat = userLocation?.latitude;
    const centerLng = userLocation?.longitude;

    console.log('createMap called, theme.isDarkMode:', theme.isDarkMode);

    // Apple Maps tarzı koyu tema için CSS ekle
    if (!document.querySelector('#apple-dark-map-styles')) {
      const style = document.createElement('style');
      style.id = 'apple-dark-map-styles';
      style.textContent = `
        .apple-dark-map {
          background-color: #0a1929 !important;
        }
        .apple-dark-map .leaflet-tile-pane {
          filter: 
            brightness(0.6) 
            invert(1) 
            contrast(1.2) 
            hue-rotate(185deg) 
            saturate(0.5);
        }
        .apple-dark-map .leaflet-control-attribution {
          background-color: rgba(10, 25, 41, 0.8) !important;
          color: #8b9dc3 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Harita oluştur
    const map = window.L.map(mapRef.current).setView([centerLat, centerLng], 16);

    // Her zaman normal OSM kullan, CSS filter uygula
    const tileLayerUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution = '© OpenStreetMap contributors';

    console.log('Initial tile layer:', tileLayerUrl);
    window.L.tileLayer(tileLayerUrl, {
      attribution: attribution,
      maxZoom: 19,
      minZoom: 10
    }).addTo(map);

    // Koyu tema ise CSS class ekle
    if (theme.isDarkMode) {
      map.getContainer().classList.add('apple-dark-map');
    }

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

    const getRestaurantMarkerColor = (type) => {
      const colorMap = {
        'CAFE': '#DC143C',
        'RESTAURANT': '#DC143C', 
        'BAR': '#DC143C',
        'BISTRO': '#DC143C',
        'default': '#DC143C'
      };
      return colorMap[type] || colorMap.default;
    };

    // Restoran marker'larını olustur
    const createRestaurantMarkers = (showLabels = true) => {
      restaurantMarkers.forEach(marker => map.removeLayer(marker));
      restaurantMarkers.length = 0;

      restaurants.forEach((restaurant) => {
        const restaurantIcon = window.L.divIcon({
          className: 'restaurant-marker',
          html: `
            <div class="marker-wrapper" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s ease;">
              <div class="marker-circle" style="background: ${getRestaurantMarkerColor(restaurant.placeType)}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); transition: all 0.2s ease;">
                <i class="${getRestaurantIconForHTML(restaurant.placeType)}" style="color: white; font-size: 14px;"></i>
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
            <style>
              .marker-wrapper:hover .marker-circle {
                transform: scale(1.2);
                box-shadow: 0 4px 16px rgba(0,0,0,0.6);
              }
            </style>
          `,
          iconSize: [140, 60],
          iconAnchor: [70, 32]
        });

        const marker = window.L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
          .addTo(map)
          .on('click', () => {
            if (onMarkerPress) {
              onMarkerPress(restaurant);
            }
          });

        restaurantMarkers.push(marker);
      });
    };

    // İlk marker'ları olustur
    createRestaurantMarkers(map.getZoom() >= 15);
    
    window.updateMapMarkers = function(newRestaurants) {
      if (newRestaurants && newRestaurants.length > 0) {
        // Eski marker'ları temizle
        restaurantMarkers.forEach(marker => map.removeLayer(marker));
        restaurantMarkers.length = 0;
        
        newRestaurants.forEach((restaurant) => {
          const restaurantIcon = window.L.divIcon({
            className: 'restaurant-marker',
            html: `
              <div class="marker-wrapper" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s ease;">
                <div class="marker-circle" style="background: ${getRestaurantMarkerColor(restaurant.placeType)}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); transition: all 0.2s ease;">
                  <i class="${getRestaurantIconForHTML(restaurant.placeType)}" style="color: white; font-size: 14px;"></i>
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
                  display: ${map.getZoom() >= 15 ? 'block' : 'none'};
                ">
                  ${restaurant.name}
                </div>
              </div>
              <style>
                .marker-wrapper:hover .marker-circle {
                  transform: scale(1.2);
                  box-shadow: 0 4px 16px rgba(0,0,0,0.6);
                }
              </style>
            `,
            iconSize: [140, 60],
            iconAnchor: [70, 32]
          });

          const marker = window.L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
            .addTo(map)
            .on('click', () => {
              if (onMarkerPress) {
                onMarkerPress(restaurant);
              }
            });

          restaurantMarkers.push(marker);
        });
      }
    };

    window.map = map;

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