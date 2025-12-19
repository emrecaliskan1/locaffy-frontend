import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { getRestaurantIconForHTML } from '../../utils/restaurantIcons';
import { useTheme } from '../../context/ThemeContext';

// WebView gerçek haritayı göstermek için(openstreetmap) kullanılıyor. Mini int tarayıcısı gibi.
// Konum yönetimi LocationContext tarafından yapılıyor - buraya sadece props olarak geliyor.

export const MobileMapView = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {
  const { theme } = useTheme();

  // userLocation veya region'dan gelen konumu kullan (LocationContext'ten geliyor)
  const getLocationFromProps = () => {
    if (userLocation) {
      return {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        accuracy: 50
      };
    }
    if (region) {
      return {
        latitude: region.latitude,
        longitude: region.longitude,
        accuracy: 50
      };
    }
    return null; // Konum yoksa null döner
  };
  
  const [currentLocation, setCurrentLocation] = useState(getLocationFromProps());
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  // userLocation veya region değiştiğinde konumu güncelle
  useEffect(() => {
    const newLocation = getLocationFromProps();
    if (newLocation) {
      setCurrentLocation(newLocation);
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'updateLocation',
          location: newLocation
        }));
      }
    }
  }, [userLocation?.latitude, userLocation?.longitude, region?.latitude, region?.longitude]);

  // Restaurants verisi degistiginde haritayı güncelle
  useEffect(() => {
    if (webViewRef.current && restaurants) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateRestaurants',
        restaurants: restaurants
      }));
    }
  }, [restaurants]);




  // Harita HTML içeriğini oluşturan fonksiyon
  const createMapHTML = () => {
    // Konum yoksa harita gösterme
    if (!currentLocation) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              background: #f5f5f5;
              font-family: sans-serif;
            }
            .message { text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="message">
            <p>Konum bekleniyor...</p>
          </div>
        </body>
        </html>
      `;
    }
    
    const centerLat = currentLocation.latitude;
    const centerLng = currentLocation.longitude;
    
    // Icon mapping fonksiyonu HTML içinde tanımla (3 kategori gruplandırma)
    const getRestaurantIconClass = (type) => {
      const foodCategories = ['kebab', 'asian-food', 'fast-food'];
      
      if (foodCategories.includes(type)) {
        return 'fas fa-utensils'; 
      } else if (type === 'cafe') {
        return 'fas fa-coffee';   
      } else if (type === 'dessert') {
        return 'fas fa-birthday-cake';  
      } else if (type === 'pub') {
        return 'fas fa-wine-glass';  
      }
      return 'fas fa-utensils';  
    };

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
      <style>
        body { margin: 0; padding: 0; }
        #mapid { height: 100vh; width: 100vw; }
        .custom-restaurant-marker { background: transparent !important; border: none !important; }
        .user-location-marker { background: transparent !important; border: none !important; }
        
        /* Apple Maps tarzı koyu tema */
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
      </style>
    </head>
    <body>
      <div id="mapid"></div>
      
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        // Restaurants verisini window objesi üzerine ekle
        window.restaurantsData = ${JSON.stringify(restaurants)};
        
        var map = L.map('mapid').setView([${centerLat}, ${centerLng}], 16);
        
        // Her zaman normal OSM kullan, CSS filter uygula
        var isDarkTheme = ${theme.isDarkMode ? 'true' : 'false'};
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          minZoom: 10
        }).addTo(map);
        
        // Koyu tema ise CSS class ekle
        if (isDarkTheme) {
          document.getElementById('mapid').classList.add('apple-dark-map');
        }
        
        var userMarker = null;
        var accuracyCircle = null;
        var restaurantMarkers = [];
        
        // Icon mapping fonksiyonu (actual database place types)
        function getRestaurantIconClass(type) {
          if (type === 'RESTAURANT' || type === 'BISTRO') {
            return 'fas fa-utensils';
          } else if (type === 'CAFE') {
            return 'fas fa-coffee';
          } else if (type === 'BAR') {
            return 'fas fa-wine-glass';
          } else if (type === 'DESSERT') {
            return 'fas fa-birthday-cake';
          } else if (type === 'FASTFOOD') {
            return 'fas fa-hamburger';
          }
          
          return 'fas fa-utensils';
        }
        
        // Restoran marker'larını oluşturan fonksiyon
        function createRestaurantMarkers(showLabels = true) {
          // Eski marker'ları temizle
          restaurantMarkers.forEach(marker => map.removeLayer(marker));
          restaurantMarkers.length = 0;

          // Restaurants veriyi window objesi üzerinden al
          const restaurants = window.restaurantsData || [];
          
          restaurants.forEach((restaurant, index) => {

            // Restoran type'ına göre marker rengi belirle
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

            const restaurantIcon = L.divIcon({
              className: 'custom-restaurant-marker',
              html: \`
                <div class="marker-wrapper" style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: all 0.2s ease;">
                  <div class="marker-circle" style="background: \${getRestaurantMarkerColor(restaurant.placeType)}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4); transition: all 0.2s ease;">
                    <i class="\${getRestaurantIconClass(restaurant.placeType)}" style="color: white; font-size: 14px;"></i>
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
                    display: \${showLabels ? 'block' : 'none'};
                  ">
                    \${restaurant.name}
                  </div>
                </div>
                <style>
                  .marker-wrapper:hover .marker-circle {
                    transform: scale(1.2);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.6);
                  }
                </style>
              \`,
              iconSize: [140, 60],
              iconAnchor: [70, 32]
            });

            const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon: restaurantIcon })
              .addTo(map)
              .on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'restaurantClick',
                  restaurant: restaurant
                }));
              });

            restaurantMarkers.push(marker);
          });
        }
        
        function updateUserLocation(lat, lng, accuracy) {
          if (userMarker) map.removeLayer(userMarker);
          if (accuracyCircle) map.removeLayer(accuracyCircle);
          
          if (accuracy && accuracy < 100) {
            accuracyCircle = L.circle([lat, lng], {
              radius: accuracy,
              color: '#4285F4',
              fillColor: '#4285F4',
              fillOpacity: 0.1,
              weight: 1
            }).addTo(map);
          }
          
          userMarker = L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(66,133,244,0.6);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(map);
          
          map.flyTo([lat, lng], 16, { duration: 1.5 });
        }
        
        // İlk marker'ları oluştur
        createRestaurantMarkers(map.getZoom() >= 15);
        
        // Zoom değiştiğinde marker'ları güncelle
        map.on('zoomend', function() {
          const currentZoom = map.getZoom();
          const showLabels = currentZoom >= 15; // Zoom 15 ve üstünde etiketleri göster
          createRestaurantMarkers(showLabels);
        });
        
        ${currentLocation ? `updateUserLocation(${currentLocation.latitude}, ${currentLocation.longitude}, ${currentLocation.accuracy || 'null'});` : ''}
        
        window.addEventListener('message', function(event) {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'updateLocation') {
              updateUserLocation(data.location.latitude, data.location.longitude, data.location.accuracy);
            }
          } catch (e) {}
        });
      </script>
    </body>
    </html>
    `;
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'restaurantClick' && onMarkerPress) {
        onMarkerPress(data.restaurant);
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <View style={styles.mapContainer}>
      <WebView
        ref={webViewRef}
        source={{ html: createMapHTML() }}
        style={styles.realMap}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
          </View>
        )}
        onLoad={() => {
          if (currentLocation && webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({
              type: 'updateLocation',
              location: currentLocation
            }));
          }
        }}
      />
    </View>
  );
};