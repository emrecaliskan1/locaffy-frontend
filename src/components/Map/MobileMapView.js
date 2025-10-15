import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

// WebView gerçek haritayı göstermek için(openstreetmap) kullanılıyor. Mini int tarayıcısı gibi.

export const MobileMapView = ({ restaurants, onMarkerPress, userLocation, region, styles }) => {

  const edirneCenter = { 
    latitude: 41.6783, 
    longitude: 26.5625, 
    accuracy: 50 
  };
  
  //Kullanıcının Anlık Konumu - Emülatör için Edirne Merkezi ekledim.
  const [currentLocation, setCurrentLocation] = useState(userLocation || edirneCenter);
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  // Kullanıcının konumunu alıp güncelleyen fonksiyon
  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        let permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          setLoading(false);
          return;
        }
      }

      // GPS'in açık olup olmadığını kontrol eder
      let gpsEnabled = await Location.hasServicesEnabledAsync();
      if (!gpsEnabled) {
        setCurrentLocation(edirneCenter);
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'updateLocation',
            location: edirneCenter
          }));
        }
        setLoading(false);
        return;
      }
      
      let location = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.BestForNavigation,
        timeout: 15000, 
        maximumAge: 1000 
      });
      
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
      };
      
      // Türkiye dışında ise Edirne merkez göster
      if (newLocation.latitude < 35 || newLocation.latitude > 43 || 
          newLocation.longitude < 25 || newLocation.longitude > 45) {
        setCurrentLocation(edirneCenter);
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'updateLocation',
            location: edirneCenter
          }));
        }
      } else {
        setCurrentLocation(newLocation);
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({
            type: 'updateLocation',
            location: newLocation
          }));
        }
      }
      
    } catch (error) {
      setCurrentLocation(edirneCenter);
      if (webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'updateLocation',
          location: edirneCenter
        }));
      }
    } finally {
      setLoading(false);
    }
  };  
  
  // Sayfa yüklendiğinde konumu alır
  useEffect(() => {
    if (!currentLocation) {
      setCurrentLocation(edirneCenter);
    }
    getCurrentLocation();
  }, []);


  // Harita HTML içeriğini oluşturan fonksiyon
  const createMapHTML = () => {
    const centerLat = currentLocation?.latitude || edirneCenter.latitude;
    const centerLng = currentLocation?.longitude || edirneCenter.longitude;
    
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        body { margin: 0; padding: 0; }
        #mapid { height: 100vh; width: 100vw; }
        .custom-restaurant-marker { background: transparent !important; border: none !important; }
        .user-location-marker { background: transparent !important; border: none !important; }
      </style>
    </head>
    <body>
      <div id="mapid"></div>
      
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script>
        var map = L.map('mapid').setView([${centerLat}, ${centerLng}], 16);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          minZoom: 10
        }).addTo(map);
        
        var userMarker = null;
        var accuracyCircle = null;
        var restaurantMarkers = [];
        
        // Restoran marker'larını oluşturan fonksiyon
        function createRestaurantMarkers(showLabels = true) {
          // Eski marker'ları temizle
          restaurantMarkers.forEach(marker => map.removeLayer(marker));
          restaurantMarkers.length = 0;

          const restaurants = ${JSON.stringify(restaurants)};
          
          restaurants.forEach((restaurant) => {
            const restaurantIcon = L.divIcon({
              className: 'custom-restaurant-marker',
              html: \`
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
                    display: \${showLabels ? 'block' : 'none'};
                  ">
                    \${restaurant.name}
                  </div>
                </div>
              \`,
              iconSize: [140, 60],
              iconAnchor: [70, 32]
            });

            const marker = L.marker([restaurant.coordinate.latitude, restaurant.coordinate.longitude], { icon: restaurantIcon })
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