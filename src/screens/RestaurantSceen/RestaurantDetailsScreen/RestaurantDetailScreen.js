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
import { mockRestaurantDetailData, restaurants } from '../../../static-data';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { FontAwesome } from '@expo/vector-icons';
import { MenuTab, ReviewsTab, InfoTab } from '../../../components/Restaurant';

export default function RestaurantDetailScreen({ route, navigation }) {
  const { restaurant } = route.params || {};
  const [activeTab, setActiveTab] = useState('menu');

  const restaurantData = restaurant 
    ? restaurants.find(r => r.id === restaurant.id) || restaurant
    : restaurants[0];

  const mockRestaurantData = {
    ...restaurantData,
    menu: mockRestaurantDetailData.menu,
    reviews: mockRestaurantDetailData.reviews,
    reviewCount: restaurantData?.reviews || mockRestaurantDetailData.reviews.length,
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuTab restaurant={mockRestaurantData} styles={styles} />;
      case 'reviews':
        return <ReviewsTab restaurant={mockRestaurantData} styles={styles} />;
      case 'info':
        return <InfoTab restaurant={mockRestaurantData} styles={styles} />;
      default:
        return <MenuTab restaurant={mockRestaurantData} styles={styles} />;
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
          <Text style={styles.headerTitle}>{mockRestaurantData.name}</Text>
          <TouchableOpacity style={styles.shareButton}>
            <FontAwesome name="heart-o" size={18} color="#E74C3C" style={styles.shareIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <Image
            source={mockRestaurantData.image}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.ratingContainer}>
              <View style={styles.ratingWrapper}>
                <FontAwesome name="star" size={16} color="#F39C12" />
                <Text style={styles.rating}> {mockRestaurantData.rating}</Text>
              </View>
              <Text style={styles.reviewCount}>({mockRestaurantData.reviewCount})</Text>
            </View>
          </View>
        </View>

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{mockRestaurantData.name}</Text>
          <Text style={styles.restaurantType}>{mockRestaurantData.type}</Text>
          <View style={styles.restaurantMeta}>
            <View style={styles.metaItem}>
              <FontAwesome name="dollar" size={14} color="#27AE60" />
              <Text style={styles.metaText}> {mockRestaurantData.priceRange}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="truck" size={14} color="#3498DB" />
              <Text style={styles.metaText}> {mockRestaurantData.deliveryTime}</Text>
            </View>
            <View style={styles.metaItem}>
              <FontAwesome name="shopping-bag" size={14} color="#E67E22" />
              <Text style={styles.metaText}> ₺{mockRestaurantData.minOrder}+ min</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.reservationButton}
          onPress={() => navigation.navigate('Reservation', { restaurant: mockRestaurantData })}
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