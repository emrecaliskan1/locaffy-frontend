import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import { MenuTab, ReviewsTab, InfoTab } from '../../../components/Restaurant';

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const [activeTab, setActiveTab] = useState('menu');

  const restaurantData = restaurant || {
    id: 1,
    name: 'Bilinmeyen Mekan',
    address: 'Adres bilgisi yok',
    averageRating: 0,
    totalRatings: 0,
  };

  // Menu ve review'ler şu an için boş - backend'den gelince eklenecek
  const finalRestaurantData = {
    ...restaurantData,
    menu: [],
    reviews: [], 
    reviewCount: restaurantData.totalRatings || 0,
    image: restaurantData.mainImageUrl || null,
    rating: restaurantData.averageRating || 0,
    distance: '1.2 km', // Şimdilik sabit
    time: '25-30 dk', // Şimdilik sabit
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuTab restaurant={finalRestaurantData} styles={styles} />;
      case 'reviews':
        return <ReviewsTab restaurant={finalRestaurantData} styles={styles} />;
      case 'info':
        return <InfoTab restaurant={finalRestaurantData} styles={styles} />;
      default:
        return <MenuTab restaurant={finalRestaurantData} styles={styles} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={18} color="#2C3E50" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{finalRestaurantData.name}</Text>
          <TouchableOpacity style={styles.shareButton}>
            <FontAwesome name="heart-o" size={18} color="#E74C3C" style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          {finalRestaurantData.image ? (
            <Image
              source={{ uri: finalRestaurantData.image }}
              style={styles.restaurantImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.restaurantImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
              <Text style={{ color: '#999', fontSize: 16 }}>Resim yok</Text>
            </View>
          )}
          <View style={styles.imageOverlay}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingWrapper}>
                <FontAwesome name="star" size={16} color="#F39C12" />
                <Text style={styles.rating}> {finalRestaurantData.rating}</Text>
              </View>
              <Text style={styles.reviewCount}>({finalRestaurantData.reviewCount})</Text>
            </View>
          </View>
        </View>

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{finalRestaurantData.name}</Text>
          <Text style={styles.restaurantType}>{finalRestaurantData.placeType || 'Restoran'}</Text>
          <View style={styles.restaurantMeta}>
            <View style={styles.metaItem}>
              <FontAwesome name="map-marker" size={14} color="#27AE60" />
              <Text style={styles.metaText}> {finalRestaurantData.address || 'Adres bilgisi yok'}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="phone" size={14} color="#3498DB" />
              <Text style={styles.metaText}> {finalRestaurantData.phoneNumber || 'Telefon yok'}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="clock-o" size={14} color="#E67E22" />
              <Text style={styles.metaText}> {finalRestaurantData.openingHours || 'Çalışma saatleri belirtilmemiş'}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.reservationButton}
          onPress={() => navigation.navigate('Reservation', { restaurant: finalRestaurantData })}
        >
          <FontAwesome name="calendar" size={16} color="#FFFFFF" style={styles.reservationIcon} />
          <Text style={styles.reservationButtonText}>Rezervasyon Yap</Text>
        </TouchableOpacity>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              <FontAwesome5 name="utensils" size={12} color="#FFFFFF" /> Menü
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              <FontAwesome name="comments-o" color="#FFFFFF" size={12} /> Yorumlar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
              <FontAwesome name="info" color="#FFFFFF" size={14} style={{marginTop:2,marginRight:2}} /> Bilgiler
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContentContainer}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
}