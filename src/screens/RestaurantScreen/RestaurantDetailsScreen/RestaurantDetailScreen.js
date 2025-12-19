import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import { MenuTab, ReviewsTab, InfoTab } from '../../../components/Restaurant';
import { reviewService, userService, menuService } from '../../../services';
import { useTheme } from '../../../context/ThemeContext';
import Toast from '../../../components/Toast';

const getPlaceTypeLabel = (type) => {
  const typeMap = {
    'CAFE': 'Kafe',
    'RESTAURANT': 'Restoran',
    'BAR': 'Bar',
    'BISTRO': 'Bistro',
    'DESSERT': 'Tatlıcı',
    'FASTFOOD': 'Fast Food',
  };
  return typeMap[type] || type;
};

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('menu');
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [menu, setMenu] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  const scrollViewRef = useRef(null);
  const menuRef = useRef(null);
  const reviewsRef = useRef(null);
  const infoRef = useRef(null);
  const [menuLayout, setMenuLayout] = useState(0);
  const [reviewsLayout, setReviewsLayout] = useState(0);
  const [infoLayout, setInfoLayout] = useState(0);
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const [tabBarY, setTabBarY] = useState(0);
  const tabBarRef = useRef(null);

  const restaurantData = restaurant || {
    id: 1,
    name: 'Bilinmeyen Mekan',
    address: 'Adres bilgisi yok',
    averageRating: 0,
    totalRatings: 0,
  };

  // Mekanın açık/kapalı kontrolü
  const getRestaurantStatus = () => {
    if (!restaurantData.workingDays || !restaurantData.openingHours) {
      return { isOpen: false, text: 'Bilgi Yok', canReserve: false };
    }
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const dayMap = {
      // Yeni format
      'PAZAR': 0, 'PAZARTESİ': 1, 'SALI': 2, 'ÇARŞAMBA': 3,
      'PERŞEMBE': 4, 'CUMA': 5, 'CUMARTESİ': 6,
      // Eski format (geriye dönük uyumluluk)
      'Pazar': 0, 'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3,
      'Perşembe': 4, 'Cuma': 5, 'Cumartesi': 6
    };

    let workingDayNumbers = [];
    const workingDays = restaurantData.workingDays.trim();
    
    if (workingDays.includes('-')) {
      const [startDay, endDay] = workingDays.split('-').map(day => day.trim());
      const startDayNum = dayMap[startDay];
      const endDayNum = dayMap[endDay];
      
      if (startDayNum !== undefined && endDayNum !== undefined) {
        if (startDayNum <= endDayNum) {
          for (let i = startDayNum; i <= endDayNum; i++) {
            workingDayNumbers.push(i);
          }
        } else {
          for (let i = startDayNum; i <= 6; i++) {
            workingDayNumbers.push(i);
          }
          for (let i = 0; i <= endDayNum; i++) {
            workingDayNumbers.push(i);
          }
        }
      }
    } else if (workingDays.includes(',')) {
      const days = workingDays.split(',').map(day => day.trim());
      workingDayNumbers = days.map(day => dayMap[day]).filter(num => num !== undefined);
    } else if (workingDays === 'PAZARTESİ,SALI,ÇARŞAMBA,PERŞEMBE,CUMA,CUMARTESİ,PAZAR' || 
               workingDays === 'Pazartesi-Pazar' || 
               workingDays === 'Hergün') {
      workingDayNumbers = [0, 1, 2, 3, 4, 5, 6];
    } else {
      const dayNum = dayMap[workingDays];
      if (dayNum !== undefined) {
        workingDayNumbers = [dayNum];
      }
    }
    const canReserveToday = workingDayNumbers.includes(currentDay);

    if (!canReserveToday) {
      return { isOpen: false, text: 'Kapalı', canReserve: false };
    }
    return { isOpen: true, text: 'Açık', canReserve: true };
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  //MEKAN YORUMLARINI YÜKLE
  const loadReviews = async () => {
    if (!restaurantData.id) return;

    try {
      setLoadingReviews(true);
      const fetchedReviews = await reviewService.getPlaceReviews(restaurantData.id);
      setReviews(fetchedReviews || []);
    } catch (error) {
      console.log('Error loading reviews:', error.message);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  //MEKAN MENÜSÜNÜ YÜKLE
  const loadMenu = async () => {
    if (!restaurantData.id) return;

    try {
      setLoadingMenu(true);
      const fetchedMenu = await menuService.getPlaceMenu(restaurantData.id);
      setMenu(fetchedMenu || []);
    } catch (error) {
      console.log('Error loading menu:', error);
      setMenu([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  //FAVORİ DURUMUNU KONTROL ET
  const checkFavoriteStatus = async () => {
    if (!restaurantData.id) return;

    try {
      const favorites = await userService.getFavorites();
      const isRestaurantFavorite = favorites.some(fav => fav.id === restaurantData.id);
      setIsFavorite(isRestaurantFavorite);
    } catch (error) {
      console.log('Error checking favorite status:', error);
      setIsFavorite(false);
    }
  };

  //FAVORİ TOGGLE
  const handleFavoriteToggle = async () => {
    if (!restaurantData.id || favoriteLoading) return;

    try {
      setFavoriteLoading(true);
      if (isFavorite) {
        await userService.removeFromFavorites(restaurantData.id);
        setIsFavorite(false);
        showToast('Mekan favorilerden çıkarıldı', 'success');
      } else {
        await userService.addToFavorites(restaurantData.id);
        setIsFavorite(true);
        showToast('Mekan favorilere eklendi', 'success');
      }
    } catch (error) {
      showToast(error.message || 'Favori işlemi gerçekleştirilemedi', 'error');
    } finally {
      setFavoriteLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    loadMenu();
  }, [restaurantData.id]);

  useFocusEffect(
    React.useCallback(() => {
      checkFavoriteStatus();
    }, [restaurantData.id])
  );

  //BACKEND'DEN GELEN MEKAN DATASI
  const finalRestaurantData = {
    ...restaurantData,
    image: restaurantData.mainImageUrl || null,
    rating: reviews.length > 0 ? (restaurantData.averageRating || 0) : 0,
    reviewCount: reviews.length || 0,
    menu: menu,
    loadingMenu: loadingMenu,
    reviews: reviews,
    loadingReviews: loadingReviews,
  };

  //MEKAN DETAY SAYFASINDAKİ TAB SEKMELERİ
  const scrollToSection = (section) => {
    setActiveTab(section);
    
    if (scrollViewRef.current) {
      if (section === 'info') {
        // Bilgiler section'ı için sayfanın en altına git
        scrollViewRef.current.scrollToEnd({ animated: true });
      } else {
        let targetY = 0;
        
        if (section === 'menu' && menuLayout > 0) {
          targetY = menuLayout - 70; 
        } else if (section === 'reviews' && reviewsLayout > 0) {
          targetY = reviewsLayout - 70;
        }
        
        if (targetY >= 0) {
          scrollViewRef.current.scrollTo({ y: targetY, animated: true });
        }
      }
    }
  };

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    if (tabBarY > 0 && scrollY >= tabBarY - 10) {
      if (!showStickyTabs) setShowStickyTabs(true);
    } else {
      if (showStickyTabs) setShowStickyTabs(false);
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
          <TouchableOpacity
            style={[
              styles.shareButton,
              { backgroundColor: theme.colors.background },
              theme.dark && { borderWidth: 1, borderColor: '#FFFFFF' }
            ]}
            onPress={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color={theme.dark ? "#FFFFFF" : "#000000"} />
            ) : (
              <FontAwesome
                name={isFavorite ? "heart" : "heart-o"}
                size={18}
                color={isFavorite ? "#E74C3C" : "#000000"}
                style={styles.shareIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Sticky Tab Bar - Scroll yaparken üstte göster */}
      {showStickyTabs && (
        <View style={[styles.stickyTabContainerFixed, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity
            style={[
              styles.stickyTab,
              activeTab === 'menu' && [styles.stickyTabActive, { borderBottomColor: theme.colors.primary }]
            ]}
            onPress={() => scrollToSection('menu')}
          >
            <Text style={[
              styles.stickyTabText, 
              { color: theme.colors.text },
              activeTab === 'menu' && [styles.stickyTabTextActive, { color: theme.colors.primary }]
            ]}>
              Menü
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.stickyTab,
              activeTab === 'reviews' && [styles.stickyTabActive, { borderBottomColor: theme.colors.primary }]
            ]}
            onPress={() => scrollToSection('reviews')}
          >
            <Text style={[
              styles.stickyTabText, 
              { color: theme.colors.text },
              activeTab === 'reviews' && [styles.stickyTabTextActive, { color: theme.colors.primary }]
            ]}>
              Yorumlar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.stickyTab,
              activeTab === 'info' && [styles.stickyTabActive, { borderBottomColor: theme.colors.primary }]
            ]}
            onPress={() => scrollToSection('info')}
          >
            <Text style={[
              styles.stickyTabText, 
              { color: theme.colors.text },
              activeTab === 'info' && [styles.stickyTabTextActive, { color: theme.colors.primary }]
            ]}>
              Bilgiler
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View>
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
          <Text style={[styles.restaurantType, { color: theme.colors.textTertiary }]}>{getPlaceTypeLabel(finalRestaurantData.placeType) || 'Restoran'}</Text>
          <View style={[styles.restaurantMeta, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
            <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', maxWidth: '100%', flexWrap: 'wrap' }}>
                <FontAwesome name="map-marker" size={14} color="#27AE60" style={{ marginTop: 2, marginRight: 5 }} />
                <Text
                  style={[styles.metaText, {
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                    flex: 1,
                    lineHeight: 20,
                    flexShrink: 1
                  }]}
                >{finalRestaurantData.address || 'Adres bilgisi yok'}</Text>
              </View>
            </View>
            {/* Phone removed as requested - keep phone number out of the area above reservation button */}
          </View>
          <View style={[styles.restaurantMeta, { justifyContent: 'center', marginTop: 10 }]}>
            <View style={styles.metaItem}>
              <FontAwesome name="star" size={14} color="#F1C40F" />
              <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}> {finalRestaurantData.rating.toFixed(1)} ({finalRestaurantData.reviewCount} {finalRestaurantData.reviewCount === 0 ? 'değerlendirme yok' : 'değerlendirme'})</Text>
            </View>
          </View>
        </View>

        {!getRestaurantStatus().canReserve && (
          <View style={{ alignItems: 'center', marginTop: 10, paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 12, color: theme.colors.textTertiary, opacity: 0.6, textAlign: 'center' }}>
              Mekan bugün hizmet vermemektedir
            </Text>
          </View>
        )}

        <TouchableOpacity 
          style={[
            styles.reservationButton, 
            { marginTop: 10 },
            !getRestaurantStatus().canReserve && { backgroundColor: '#95A5A6', opacity: 0.6 }
          ]}
          onPress={() => {
            if (getRestaurantStatus().canReserve) {
              navigation.navigate('Reservation', { restaurant: finalRestaurantData });
            }
          }}
          disabled={!getRestaurantStatus().canReserve}
        >
          <FontAwesome name="calendar" size={16} color="#FFFFFF" style={styles.reservationIcon} />
          <Text style={styles.reservationButtonText}>Rezervasyon Yap</Text>
        </TouchableOpacity>
        </View>

        {/* Tab Bar */}
        <View 
          ref={tabBarRef}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setTabBarY(layout.y);
          }}
          style={[styles.stickyTabContainer, { backgroundColor: theme.colors.background }]}
        >
          <TouchableOpacity
            style={[
              styles.stickyTab,
              activeTab === 'menu' && [styles.stickyTabActive, { borderBottomColor: theme.colors.primary }]
            ]}
            onPress={() => scrollToSection('menu')}
          >
            <Text style={[
              styles.stickyTabText, 
              { color: theme.colors.text },
              activeTab === 'menu' && [styles.stickyTabTextActive, { color: theme.colors.primary }]
            ]}>
              Menü
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.stickyTab,
              activeTab === 'reviews' && [styles.stickyTabActive, { borderBottomColor: theme.colors.primary }]
            ]}
            onPress={() => scrollToSection('reviews')}
          >
            <Text style={[
              styles.stickyTabText, 
              { color: theme.colors.text },
              activeTab === 'reviews' && [styles.stickyTabTextActive, { color: theme.colors.primary }]
            ]}>
              Yorumlar
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.stickyTab,
              activeTab === 'info' && [styles.stickyTabActive, { borderBottomColor: theme.colors.primary }]
            ]}
            onPress={() => scrollToSection('info')}
          >
            <Text style={[
              styles.stickyTabText, 
              { color: theme.colors.text },
              activeTab === 'info' && [styles.stickyTabTextActive, { color: theme.colors.primary }]
            ]}>
              Bilgiler
            </Text>
          </TouchableOpacity>
        </View>

        <View 
          ref={menuRef}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setMenuLayout(layout.y);
          }}
        >
          <MenuTab restaurant={finalRestaurantData} styles={styles} />
        </View>

        <View 
          ref={reviewsRef}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setReviewsLayout(layout.y);
          }}
        >
          <ReviewsTab restaurant={finalRestaurantData} styles={styles} />
        </View>

        <View 
          ref={infoRef}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setInfoLayout(layout.y);
          }}
        >
          <InfoTab restaurant={finalRestaurantData} styles={styles} />
        </View>
      </ScrollView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
    </View>
  );
}