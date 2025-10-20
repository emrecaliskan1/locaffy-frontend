import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { restaurants } from '../../static-data/restaurants';
import { RestaurantModal, ModernMapView } from '../../components/Map';

export default function MapScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 41.6771,
    longitude: 26.5557,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [infoCardVisible, setInfoCardVisible] = useState(true);
  const [infoCardAnimation] = useState(new Animated.Value(1));
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);

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
    setSelectedRestaurant(restaurant);
    setModalVisible(true);
  };

  const handleViewDetails = (restaurant) => {
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRestaurant(null);
  };

  const toggleInfoCard = () => {
    if (infoCardVisible) {
      Animated.timing(infoCardAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setInfoCardVisible(false));
    } else {
      setInfoCardVisible(true);
      Animated.timing(infoCardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Map screendeki bilgilendirme Card'ı için
  const categoryInfo = [
    { 
      types: ['fast-food', 'asian-food', 'kebab'], 
      icon: 'cutlery', 
      iconFamily: 'FontAwesome',
      label: 'Yemek', 
      description: 'Fast-food, Asya mutfağı, Steakhouse'
    },
    { 
      types: ['dessert'], 
      icon: 'birthday-cake', 
      iconFamily: 'FontAwesome',
      label: 'Tatlı', 
      description: 'Tatlıcı, Pastane'
    },
    { 
      types: ['cafe'], 
      icon: 'coffee', 
      iconFamily: 'FontAwesome',
      label: 'Kahve', 
      description: 'Cafe'
    },
    { 
      types: ['pub'], 
      icon: 'wine-glass-alt', 
      iconFamily: 'FontAwesome5',
      label: 'Bar', 
      description: 'Pub, Bar, Alkollü mekanlar'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edirne Haritası</Text>
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={getLocation}>
            <FontAwesome name="map-marker" size={18} color="#4285F4" style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={styles.loadingText}>Konum alınıyor...</Text>
        </View>
      ) : (
        <>
          <ModernMapView
            restaurants={restaurants}
            onMarkerPress={handleMarkerPress}
            userLocation={userLocation}
            region={region}
            styles={styles}
            onBottomSheetToggle={setBottomSheetExpanded}
          />
          
          {infoCardVisible && (
            <Animated.View 
              style={[
                styles.infoCard, 
                { 
                  opacity: infoCardAnimation,
                  transform: [{ 
                    translateY: infoCardAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0], 
                    }) 
                  }]
                }
              ]}
            >
              <View style={styles.infoCardHeader}>
                <Text style={styles.infoCardTitle}>Marker Kategorileri</Text>
                <TouchableOpacity 
                  style={styles.infoCardCloseButton} 
                  onPress={toggleInfoCard}
                >
                  <FontAwesome name="times" size={12} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.infoCardContent}>
                {categoryInfo.map((category, index) => (
                  <View key={index} style={styles.categoryRow}>
                    <View style={styles.categoryIcon}>
                      {category.iconFamily === 'FontAwesome5' ? (
                        <FontAwesome5 name={category.icon} size={14} color="#fff" />
                      ) : (
                        <FontAwesome name={category.icon} size={14} color="#fff" />
                      )}
                    </View>
                    <View style={styles.categoryText}>
                      <Text style={styles.categoryLabel}>{category.label}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {!infoCardVisible && !bottomSheetExpanded && (
            <TouchableOpacity 
              style={styles.infoToggleButton} 
              onPress={toggleInfoCard}
            >
              <FontAwesome name="info-circle" size={16} color="#4285F4" />
            </TouchableOpacity>
          )}
        </>
      )}

      <RestaurantModal
        visible={modalVisible}  
        restaurant={selectedRestaurant}
        onClose={closeModal}
        onViewDetails={handleViewDetails}
        styles={styles}
      />
    </View>
  );
}