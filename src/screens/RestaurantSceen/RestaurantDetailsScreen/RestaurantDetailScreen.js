import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import { MenuTab, ReviewsTab, InfoTab } from '../../../components/Restaurant';
import { reviewService } from '../../../services';
import { useTheme } from '../../../context/ThemeContext';

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('menu');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const restaurantData = restaurant || {
    id: 1,
    name: 'Bilinmeyen Mekan',
    address: 'Adres bilgisi yok',
    averageRating: 0,
    totalRatings: 0,
  };

  //MEKAN YORUMLARINI YÜKLE
  const loadReviews = async () => {
    if (!restaurantData.id) return;
    
    try {
      setLoadingReviews(true);
      const fetchedReviews = await reviewService.getPlaceReviews(restaurantData.id);
      setReviews(fetchedReviews || []);
    } catch (error) {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [restaurantData.id]);

  //BACKEND'DEN GELEN MEKAN DATASI
  const finalRestaurantData = {
    ...restaurantData,
    image: restaurantData.mainImageUrl || null,
    rating: reviews.length > 0 ? (restaurantData.averageRating || 0) : 0,
    reviewCount: reviews.length || 0,
    menu: restaurantData.menuItems || [],
    reviews: reviews,
    loadingReviews: loadingReviews,
  };

  //MEKAN DETAY SAYFASINDAKİ TAB SEKMELERİ
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{finalRestaurantData.name}</Text>
          <TouchableOpacity style={[
            styles.shareButton, 
            { backgroundColor: theme.colors.background },
            theme.dark && { borderWidth: 1, borderColor: '#FFFFFF' }
          ]}>
            <FontAwesome name="heart-o" size={18} color={theme.dark ? "#FFFFFF" : "#000000"} style={styles.shareIcon} />
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
        </View>

        <View style={[styles.restaurantInfo, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.restaurantName, { color: theme.colors.text }]}>{finalRestaurantData.name}</Text>
          <Text style={[styles.restaurantType, { color: theme.colors.textTertiary }]}>{finalRestaurantData.placeType || 'Restoran'}</Text>
          <View style={[styles.restaurantMeta, { justifyContent: 'space-between' }]}>
            <View style={[styles.metaItem, { flex: 1, alignItems: 'flex-start' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="map-marker" size={14} color="#27AE60" />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}> {finalRestaurantData.address || 'Adres bilgisi yok'}</Text>
              </View>
            </View>
            <View style={[styles.metaItem, { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name="phone" size={14} color="#3498DB" />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}> {finalRestaurantData.phoneNumber || 'Telefon yok'}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.restaurantMeta, { justifyContent: 'center', marginTop: 10 }]}>
            <View style={styles.metaItem}>
              <FontAwesome name="star" size={14} color="#F1C40F" />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}> {finalRestaurantData.rating.toFixed(1)} ({finalRestaurantData.reviewCount} {finalRestaurantData.reviewCount === 0 ? 'değerlendirme yok' : 'değerlendirme'})</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.reservationButton, { marginTop: 10 }]}
          onPress={() => navigation.navigate('Reservation', { restaurant: finalRestaurantData })}
        >
          <FontAwesome name="calendar" size={16} color="#FFFFFF" style={styles.reservationIcon} />
          <Text style={styles.reservationButtonText}>Rezervasyon Yap</Text>
        </TouchableOpacity>

        <View style={[styles.tabContainer, { backgroundColor: theme.colors.background, marginTop: 10 }]}>
          <TouchableOpacity
            style={[
              styles.tab, 
              { backgroundColor: theme.colors.card, marginRight: 8 },
              activeTab === 'menu' 
                ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, borderWidth: 3 }
                : { borderColor: theme.colors.border }
            ]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'menu' ? '#FFFFFF' : theme.colors.text }]}>
              <FontAwesome5 name="utensils" size={12} color={activeTab === 'menu' ? '#FFFFFF' : theme.colors.text} /> Menü
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab, 
              { backgroundColor: theme.colors.card, marginRight: 8 },
              activeTab === 'reviews' 
                ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, borderWidth: 3 }
                : { borderColor: theme.colors.border }
            ]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'reviews' ? '#FFFFFF' : theme.colors.text }]}>
              <FontAwesome name="comments-o" color={activeTab === 'reviews' ? '#FFFFFF' : theme.colors.text} size={12} /> Yorumlar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab, 
              { backgroundColor: theme.colors.card },
              activeTab === 'info' 
                ? { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, borderWidth: 3 }
                : { borderColor: theme.colors.border }
            ]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, { color: activeTab === 'info' ? '#FFFFFF' : theme.colors.text }]}>
              <FontAwesome name="info" color={activeTab === 'info' ? '#FFFFFF' : theme.colors.text} size={14} style={{marginTop:2,marginRight:2}} /> Bilgiler
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContentContainer, { backgroundColor: theme.colors.background }]}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </View>
  );
}