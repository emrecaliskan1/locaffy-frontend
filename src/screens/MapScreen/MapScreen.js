import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions
} from 'react-native';
import * as Location from 'expo-location';
import { styles } from './styles';
import { restaurants } from '../../static-data/restaurants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = 250;
const BOTTOM_SHEET_MIN_HEIGHT = 50;

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

// Gerçek Google Maps benzeri harita komponenti
const RealMapComponent = ({ restaurants, onMarkerPress, userLocation, region }) => {
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
        {/* Kullanıcı konumu */}
        {userLocation && (
          <ExpoMarker
            coordinate={userLocation}
            title="Konumunuz"
            description="Şu anki konumunuz"
            pinColor="blue"
          />
        )}
        
        {/* Restaurant marker'ları */}
        {restaurants.map((restaurant) => (
          <ExpoMarker
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
          </ExpoMarker>
        ))}
      </ExpoMap>
    </View>
  );
};

// Basit Kaydırılabilir Bottom Sheet komponenti
const DraggableBottomSheet = ({ restaurants, onMarkerPress }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const toggleSheet = () => {
    const toValue = isExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
    
    Animated.spring(animatedHeight, {
      toValue,
      damping: 15,
      mass: 1,
      stiffness: 150,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: animatedHeight,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.bottomSheetHeader}
        onPress={toggleSheet}
        activeOpacity={0.8}
      >
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Yakındaki Restoranlar</Text>
      </TouchableOpacity>
      
      {isExpanded && (
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
                <Text style={styles.restaurantItemDistance}>{restaurant.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};

// Web için fallback harita komponenti
const WebMapComponent = ({ restaurants, onMarkerPress, userLocation, region }) => {
  return (
    <View style={styles.webMapContainer}>
      <View style={styles.webMapView}>
        <View style={styles.mapBackground}>
          {/* Grid çizgileri */}
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
          
          {/* Kullanıcı konumu */}
          <View style={[styles.webUserLocation, { top: '50%', left: '50%' }]}>
            <View style={styles.webUserDot}>
              <View style={styles.webUserInner} />
            </View>
          </View>
          
          {/* Restaurant marker'ları */}
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
        
        {/* Harita kontrolleri */}
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

const ModernMapView = ({ restaurants, onMarkerPress, userLocation, region }) => {
  // Platform'a göre uygun komponenti seç
  if (Platform.OS === 'web') {
    // Web'de fallback harita kullan
    return (
      <View style={styles.mapContainer}>
        <WebMapComponent
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
          userLocation={userLocation}
          region={region}
        />
        
        {/* Kaydırılabilir bottom sheet */}
        <DraggableBottomSheet 
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
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
        />
        
        {/* Kaydırılabilir bottom sheet */}
        <DraggableBottomSheet 
          restaurants={restaurants}
          onMarkerPress={onMarkerPress}
        />
      </View>
    );
  }
};

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 41.6771,
    longitude: 26.5557,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Konum İzni', 'Konum izni verilmedi. Varsayılan konum gösterilecek.');
        setUserLocation({ latitude: 41.6771, longitude: 26.5557 });
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({ 
        accuracy: Location.Accuracy.Balanced 
      });
      
      setUserLocation({ 
        latitude: location.coords.latitude, 
        longitude: location.coords.longitude 
      });
      
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      setUserLocation({ latitude: 41.6771, longitude: 26.5557 });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (restaurant) => {
    Alert.alert(
      restaurant.name,
      `${restaurant.type} - ⭐ ${restaurant.rating}\n📍 ${restaurant.address}`,
      [
        { text: 'Kapat', style: 'cancel' },
        { 
          text: 'Detay Gör', 
          onPress: () => navigation.navigate('RestaurantDetail', { restaurant }) 
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Edirne Haritası</Text>
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={getLocation}
        >
          <Text style={styles.searchIcon}>📍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Konum alınıyor...</Text>
        </View>
      ) : (
        <ModernMapView
          restaurants={restaurants}
          onMarkerPress={handleMarkerPress}
          userLocation={userLocation}
          region={region}
        />
      )}
    </SafeAreaView>
  );
}