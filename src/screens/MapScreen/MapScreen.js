import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { styles } from './styles';
import { restaurants } from '../../static-data';

let MapView, Marker, PROVIDER_GOOGLE;

const loadMapComponents = () => {
  if (Platform.OS !== 'web') {
    try {
      const RNMaps = require('react-native-maps');
      MapView = RNMaps.default;
      Marker = RNMaps.Marker;
      PROVIDER_GOOGLE = RNMaps.PROVIDER_GOOGLE;
    } catch (error) {
      console.warn('react-native-maps could not be loaded:', error);
      MapView = null;
      Marker = null;
      PROVIDER_GOOGLE = null;
    }
  } else {
    MapView = null;
    Marker = null;
    PROVIDER_GOOGLE = null;
  }
};

const RealGoogleMapsView = ({ restaurants, onMarkerPress, userLocation, region }) => {
  if (Platform.OS === 'web') {
    // Web için mobil benzeri harita görünümü
    return (
      <View style={styles.mapContainer}>
        <View style={styles.webMobileMap}>
          <View style={styles.mapBackground}>

            {[...Array(10)].map((_, i) => (
              <View key={`h${i}`} style={[styles.gridLine, { top: `${i * 10}%`, left: 0, right: 0, height: 1 }]} />
            ))}
            {[...Array(8)].map((_, i) => (
              <View key={`v${i}`} style={[styles.gridLine, { left: `${i * 12.5}%`, top: 0, bottom: 0, width: 1 }]} />
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
                <TouchableOpacity 
                  key={restaurant.id}
                  style={[styles.webRestaurantPin, positions[index]]}
                  onPress={() => onMarkerPress(restaurant)}
                >
                  <View style={styles.webPinHead}>
                    <Text style={styles.webPinIcon}>🍽️</Text>
                  </View>
                  <View style={styles.webPinPoint} />
                </TouchableOpacity>
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
        
        <View style={styles.bottomSheet}>
          <View style={styles.bottomSheetHandle} />
          <Text style={styles.bottomSheetTitle}>Yakındaki Restoranlar</Text>
          <ScrollView 
            style={styles.restaurantScrollList} 
            showsVerticalScrollIndicator={false}
          >
            {restaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantListItem}
                onPress={() => onMarkerPress(restaurant)}
              >
                <View style={styles.restaurantItemInfo}>
                  <Text style={styles.restaurantItemName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantItemType}>{restaurant.type}</Text>
                  <Text style={styles.restaurantItemRating}>⭐ {restaurant.rating}</Text>
                  <Text style={styles.restaurantItemAddress}>{restaurant.address}</Text>
                </View>
                <View style={styles.restaurantItemRight}>
                  <Text style={styles.restaurantItemIcon}>🍽️</Text>
                  <Text style={styles.restaurantItemDistance}>~500m</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.realMap}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        loadingEnabled={true}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Konumunuz"
            description="Şu anki konumunuz"
            pinColor="blue"
          />
        )}
        
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={restaurant.coordinate}
            title={restaurant.name}
            description={`${restaurant.type} - ⭐ ${restaurant.rating}`}
            onPress={() => onMarkerPress(restaurant)}
          >
            <View style={styles.customMarker}>
              <View style={styles.markerContainer}>
                <Text style={styles.markerEmoji}>🍽️</Text>
              </View>
              <View style={styles.markerTriangle} />
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Yakındaki Restoranlar</Text>
        <ScrollView 
          style={styles.restaurantScrollList} 
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantListItem}
              onPress={() => onMarkerPress(restaurant)}
            >
              <View style={styles.restaurantItemInfo}>
                <Text style={styles.restaurantItemName}>{restaurant.name}</Text>
                <Text style={styles.restaurantItemType}>{restaurant.type}</Text>
                <Text style={styles.restaurantItemRating}>⭐ {restaurant.rating}</Text>
                <Text style={styles.restaurantItemAddress}>{restaurant.address}</Text>
              </View>
              <View style={styles.restaurantItemRight}>
                <Text style={styles.restaurantItemIcon}>🍽️</Text>
                <Text style={styles.restaurantItemDistance}>~500m</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 41.6771,
    longitude: 26.5557,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [userLocation, setUserLocation] = useState({
    latitude: 41.6771,
    longitude: 26.5557,
  });
  const [locationPermission, setLocationPermission] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMapComponents();
    getLocationPermission();
  }, []);

  const getLocationPermission = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Konum İzni',
          'Yakındaki restoranları görmek için konum iznine ihtiyacımız var.',
          [
            { text: 'İptal', style: 'cancel' },
            { text: 'Tekrar Dene', onPress: getLocationPermission }
          ]
        );
        setLoading(false);
        return;
      }

      setLocationPermission(true);
      
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(newLocation);
      setRegion({
        ...newLocation,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      
    } catch (error) {
      console.log('Konum alma hatası:', error);
      Alert.alert('Hata', 'Konum alınamadı. Varsayılan konum kullanılacak.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (restaurant) => {
    Alert.alert(
      restaurant.name,
      `${restaurant.type} - ⭐ ${restaurant.rating}\n📍 ${restaurant.address}`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Detay',
          onPress: () => navigation.navigate('RestaurantDetail', { restaurant }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edirne Haritası</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={getLocationPermission}
        >
          <Text style={styles.searchIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>📍 Konum alınıyor...</Text>
          <Text style={styles.loadingSubtext}>Lütfen bekleyin</Text>
        </View>
      ) : (
        <RealGoogleMapsView 
          restaurants={restaurants} 
          onMarkerPress={handleMarkerPress}
          userLocation={userLocation}
          region={region}
        />
      )}

      {/* Bottom Info Bar */}
      <View style={styles.bottomInfo}>
        <Text style={styles.infoText}>
          {restaurants.length} restoran Edirne'de
        </Text>
        <TouchableOpacity 
          style={styles.listButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.listButtonText}>Liste Görünümü</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabSpacer} />
    </SafeAreaView>
  );
}