import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView,
  FlatList,
  Modal,
  Linking,
  Platform
} from 'react-native';
import { useState, useRef, useEffect } from 'react';
let MapView, Marker, Callout;
try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Callout = maps.Callout;
} catch (e) {
  MapView = null;
  Marker = null;
  Callout = null;
}

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [activeTab, setActiveTab] = useState('menu');
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const mapRef = useRef(null);
  const [showUserLocation, setShowUserLocation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Try to load expo-location dynamically when needed
  const getLocationAsync = async () => {
    try {
      const loc = require('expo-location');
      const { requestForegroundPermissionsAsync, getCurrentPositionAsync } = loc;
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin gerekli', 'Konum izni verilmedi. Lütfen izin verin.');
        return null;
      }
      const pos = await getCurrentPositionAsync({ accuracy: 3 });
      return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    } catch (e) {
      // expo-location not available; try navigator.geolocation
      return new Promise((resolve, reject) => {
        if (navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition) {
          navigator.geolocation.getCurrentPosition(
            (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
            (err) => reject(err),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        } else {
          reject(new Error('Konum API bulunamadı'));
        }
      }).catch(() => null);
    }
  };

  const openDirections = (lat, lng) => {
    const label = encodeURIComponent(mockRestaurantData.name || 'Restoran');
    // Universal web fallback URL (works on both platforms)
    const googleUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    // Try map app schemes first
    const url = Platform.OS === 'ios'
      ? `maps:0,0?q=${lat},${lng}(${label})`
      : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
    Linking.openURL(url).catch(() => {
      Linking.openURL(googleUrl).catch(() => Alert.alert('Açma hatası', 'Harita açılamıyor.'));
    });
  };

  const handleShowUserLocation = async () => {
    if (!MapView) {
      Alert.alert('Harita yüklü değil', 'Lütfen önce react-native-maps paketini kurun.');
      return;
    }
    if (showUserLocation) {
      setShowUserLocation(false);
      setUserLocation(null);
      return;
    }
    const pos = await getLocationAsync();
    if (pos) {
      setUserLocation(pos);
      setShowUserLocation(true);
      // center map
      setTimeout(() => {
        try {
          if (mapRef.current && mapRef.current.animateToRegion) {
            mapRef.current.animateToRegion({
              latitude: pos.latitude,
              longitude: pos.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }, 500);
          }
        } catch (e) {}
      }, 300);
    } else {
      Alert.alert('Konum alınamadı', 'Lütfen cihaz konumunuzun açık olduğundan emin olun.');
    }
  };

  // Mock data - Backend'den gelecek
  const mockRestaurantData = {
    ...restaurant,
    address: 'Beşiktaş, İstanbul',
    // Mock coordinates (lat, lng) for map preview
    latitude: 41.0476,
    longitude: 29.0050,
    phone: '+90 212 123 45 67',
    workingHours: '09:00 - 23:00',
    description: 'Lezzetli et yemekleri ve özel soslarla hazırlanan yemeklerimizi deneyin.',
    features: ['Rezervasyon', 'Açık Alan', 'Otopark', 'WiFi'],
    menu: {
      categories: [
        {
          id: 'main',
          name: 'Ana Yemekler',
          items: [
            {
              id: 1,
              name: 'Izgara Biftek',
              description: 'Özel baharatlarla marine edilmiş dana biftek',
              price: 89.90,
              image: require('../../assets/steakhouse.jpeg'),
              isPopular: true
            },
            {
              id: 2,
              name: 'Tavuk Şinitzel',
              description: 'Çıtır tavuk göğsü, patates kızartması ile',
              price: 65.90,
              image: require('../../assets/steakhouse.jpeg'),
              isPopular: false
            },
            {
              id: 3,
              name: 'Balık Fileto',
              description: 'Taze levrek fileto, sebze garnitürü ile',
              price: 75.90,
              image: require('../../assets/steakhouse.jpeg'),
              isPopular: true
            }
          ]
        },
        {
          id: 'drinks',
          name: 'İçecekler',
          items: [
            {
              id: 4,
              name: 'Ayran',
              description: 'Ev yapımı ayran',
              price: 8.90,
              image: require('../../assets/steakhouse.jpeg'),
              isPopular: false
            },
            {
              id: 5,
              name: 'Türk Kahvesi',
              description: 'Geleneksel Türk kahvesi',
              price: 12.90,
              image: require('../../assets/steakhouse.jpeg'),
              isPopular: true
            }
          ]
        },
        {
          id: 'desserts',
          name: 'Tatlılar',
          items: [
            {
              id: 6,
              name: 'Baklava',
              description: 'Antep fıstıklı baklava',
              price: 25.90,
              image: require('../../assets/steakhouse.jpeg'),
              isPopular: true
            }
          ]
        }
      ]
    },
    reviews: [
      {
        id: 1,
        userName: 'Ahmet Y.',
        rating: 5,
        comment: 'Harika bir restoran! Et yemekleri çok lezzetli.',
        date: '2024-01-15',
        helpful: 12
      },
      {
        id: 2,
        userName: 'Fatma K.',
        rating: 4,
        comment: 'Güzel bir mekan, servis hızlı. Tavsiye ederim.',
        date: '2024-01-10',
        helpful: 8
      },
      {
        id: 3,
        userName: 'Mehmet S.',
        rating: 5,
        comment: 'Fiyat performans açısından çok iyi. Kesinlikle tekrar geleceğim.',
        date: '2024-01-08',
        helpful: 15
      }
    ]
  };

  const tabs = [
    { id: 'menu', name: 'Menü', icon: '🍽️' },
    { id: 'reviews', name: 'Yorumlar', icon: '⭐' },
    { id: 'info', name: 'Bilgiler', icon: 'ℹ️' }
  ];

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Image source={item.image} style={styles.menuItemImage} />
      <View style={styles.menuItemContent}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          {item.isPopular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Popüler</Text>
            </View>
          )}
        </View>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>₺{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, index) => (
              <Text key={index} style={styles.star}>
                {index < item.rating ? '⭐' : '☆'}
              </Text>
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
      <TouchableOpacity style={styles.helpfulButton}>
        <Text style={styles.helpfulText}>👍 Yararlı ({item.helpful})</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMenuContent = () => (
    <View style={styles.tabContent}>
      {mockRestaurantData.menu.categories.map((category) => (
        <View key={category.id} style={styles.menuCategory}>
          <Text style={styles.categoryTitle}>{category.name}</Text>
          <FlatList
            data={category.items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMenuItem}
            scrollEnabled={false}
          />
        </View>
      ))}
    </View>
  );

  const renderReviewsContent = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={mockRestaurantData.reviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReview}
        scrollEnabled={false}
      />
    </View>
  );

  const renderInfoContent = () => (
    <View style={styles.tabContent}>
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📍 Adres</Text>
        <Text style={styles.infoText}>{mockRestaurantData.address}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📞 Telefon</Text>
        <Text style={styles.infoText}>{mockRestaurantData.phone}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>🕒 Çalışma Saatleri</Text>
        <Text style={styles.infoText}>{mockRestaurantData.workingHours}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📝 Hakkında</Text>
        <Text style={styles.infoText}>{mockRestaurantData.description}</Text>
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>✨ Özellikler</Text>
        <View style={styles.featuresContainer}>
          {mockRestaurantData.features.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'menu':
        return renderMenuContent();
      case 'reviews':
        return renderReviewsContent();
      case 'info':
        return renderInfoContent();
      default:
        return renderMenuContent();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Restoran Detayı</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>🤍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Image source={mockRestaurantData.image} style={styles.restaurantImage} />
          <View style={styles.restaurantDetails}>
            <Text style={styles.restaurantName}>{mockRestaurantData.name}</Text>
            <Text style={styles.restaurantType}>{mockRestaurantData.type}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.rating}>{mockRestaurantData.rating}</Text>
              <Text style={styles.reviews}>({mockRestaurantData.reviews.length} yorum)</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{mockRestaurantData.distance}</Text>
              <Text style={styles.infoIcon}>⏰</Text>
              <Text style={styles.infoText}>{mockRestaurantData.deliveryTime}</Text>
            </View>
            {/* Map preview placeholder (click to open) */}
            <TouchableOpacity style={styles.mapPreview} onPress={() => setMapModalVisible(true)}>
              {/* Small non-interactive preview map */}
              {MapView ? (
                <MapView
                  style={styles.smallMap}
                  initialRegion={{
                    latitude: mockRestaurantData.latitude,
                    longitude: mockRestaurantData.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  showsCompass={false}
                  zoomEnabled={false}
                  scrollEnabled={false}
                  rotateEnabled={false}
                >
                  {Marker && (
                    <Marker
                      coordinate={{ latitude: mockRestaurantData.latitude, longitude: mockRestaurantData.longitude }}
                      title={mockRestaurantData.name}
                      description={mockRestaurantData.address}
                    >
                      {Callout && (
                        <Callout>
                          <View style={styles.callout}>
                            <Text style={styles.calloutTitle}>{mockRestaurantData.name}</Text>
                            <Text style={styles.calloutText}>{mockRestaurantData.address}</Text>
                            <TouchableOpacity style={styles.directionsButton} onPress={() => openDirections(mockRestaurantData.latitude, mockRestaurantData.longitude)}>
                              <Text style={styles.directionsButtonText}>Yol Tarifi</Text>
                            </TouchableOpacity>
                          </View>
                        </Callout>
                      )}
                    </Marker>
                  )}
                </MapView>
              ) : (
                <View style={[styles.smallMap, { justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={styles.mapText}>Harita yüklenemiyor</Text>
                </View>
              )}
              <View style={{ paddingTop: 8, alignItems: 'center' }}>
                <Text style={styles.mapText}>📍 {mockRestaurantData.address}</Text>
                <Text style={styles.mapCoords}>Lat: {mockRestaurantData.latitude.toFixed(4)}, Lng: {mockRestaurantData.longitude.toFixed(4)}</Text>
                <Text style={styles.mapHint}>Haritayı açmak için dokunun</Text>
              </View>
            </TouchableOpacity>

            <Modal
              visible={mapModalVisible}
              animationType="slide"
              onRequestClose={() => setMapModalVisible(false)}
            >
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setMapModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalMap}>
                  {MapView ? (
                    <MapView
                      style={styles.fullMap}
                      initialRegion={{
                        latitude: mockRestaurantData.latitude,
                        longitude: mockRestaurantData.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      showsUserLocation={false}
                    >
                      {Marker && (
                            <Marker
                              coordinate={{ latitude: mockRestaurantData.latitude, longitude: mockRestaurantData.longitude }}
                              title={mockRestaurantData.name}
                              description={mockRestaurantData.address}
                            >
                              {Callout && (
                                <Callout>
                                  <View style={styles.callout}>
                                    <Text style={styles.calloutTitle}>{mockRestaurantData.name}</Text>
                                    <Text style={styles.calloutText}>{mockRestaurantData.address}</Text>
                                    <TouchableOpacity style={styles.directionsButton} onPress={() => openDirections(mockRestaurantData.latitude, mockRestaurantData.longitude)}>
                                      <Text style={styles.directionsButtonText}>Yol Tarifi</Text>
                                    </TouchableOpacity>
                                  </View>
                                </Callout>
                              )}
                            </Marker>
                          )}
                    </MapView>
                  ) : (
                    <View style={styles.modalMap}>
                      <Text style={styles.mapTextLarge}>Harita yüklenemiyor</Text>
                      <Text style={styles.mapCoordsLarge}>Lat: {mockRestaurantData.latitude.toFixed(6)}, Lng: {mockRestaurantData.longitude.toFixed(6)}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.modalActionsRow}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => openDirections(mockRestaurantData.latitude, mockRestaurantData.longitude)}>
                    <Text style={styles.actionButtonText}>Yol Tarifi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.locationButton]} onPress={handleShowUserLocation}>
                    <Text style={[styles.actionButtonText, styles.locationButtonText]}>{showUserLocation ? 'Konumumu Gizle' : 'Konumumu Göster'}</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Menu', { restaurant: mockRestaurantData })}
          >
            <Text style={styles.primaryButtonText}>
              {mockRestaurantData.isSelfService ? 'Menüyü Gör' : 'Sipariş Ver'}
            </Text>
          </TouchableOpacity>
          {!mockRestaurantData.isSelfService && (
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Reservation', { restaurant: mockRestaurantData })}
            >
              <Text style={styles.secondaryButtonText}>Rezervasyon Yap</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 20 },
  primaryButton: { flex: 1, backgroundColor: '#FF6B35', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginRight: 10 },
  primaryButtonText: { color: '#FFF', fontWeight: '700' },
  secondaryButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FF6B35', paddingVertical: 12, borderRadius: 12, alignItems: 'center', paddingHorizontal: 16 },
  secondaryButtonText: { color: '#FF6B35', fontWeight: '700' },
  menuHiddenNotice: { padding: 20, alignItems: 'center' },
  menuHiddenText: { color: '#7F8C8D', textAlign: 'center' },
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  content: {
    flex: 1,
  },
  restaurantInfo: {
    padding: 20,
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 15,
  },
  restaurantDetails: {
    alignItems: 'center',
  },
  mapPreview: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  mapText: {
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 4,
  },
  mapCoords: {
    color: '#7F8C8D',
    fontSize: 12,
  },
  mapHint: {
    marginTop: 8,
    fontSize: 12,
    color: '#7F8C8D',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  modalHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'flex-end'
  },
  modalCloseButton: {
    padding: 8,
  },
  modalCloseText: {
    color: '#2C3E50',
    fontWeight: '600'
  },
  modalMap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mapTextLarge: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  mapCoordsLarge: {
    fontSize: 14,
    color: '#7F8C8D'
  },
  smallMap: {
    width: '100%',
    height: 140,
    borderRadius: 12,
  },
  fullMap: {
    width: '100%',
    height: '100%'
  },
  modalActions: {
    padding: 16,
  },
  openMapsButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center'
  },
  openMapsText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  callout: {
    width: 200,
  },
  calloutTitle: {
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 4,
  },
  calloutText: {
    color: '#7F8C8D',
    marginBottom: 8,
  },
  directionsButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  locationButtonText: {
    color: '#FF6B35'
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  restaurantType: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ratingIcon: {
    fontSize: 18,
    marginRight: 5,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginRight: 5,
  },
  reviews: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  infoIcon: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  menuCategory: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  reviewItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUser: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  reviewComment: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 10,
  },
  helpfulButton: {
    alignSelf: 'flex-start',
  },
  helpfulText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
