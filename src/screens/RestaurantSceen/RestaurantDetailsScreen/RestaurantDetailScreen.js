import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { styles } from './styles';
import { mockRestaurantDetailData, restaurants } from '../../../static-data';

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

  const renderMenuTab = () => (
    <View style={styles.tabContent}>
      {mockRestaurantData.menu.categories.map((category) => (
        <View key={category.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{category.name}</Text>
          <FlatList
            data={category.items}
            renderItem={({ item }) => (
              <View style={styles.menuItem}>
                <Image source={item.image} style={styles.menuItemImage} />
                <View style={styles.menuItemInfo}>
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
              </View>
            )}
            scrollEnabled={false}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      ))}
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Müşteri Yorumları ({mockRestaurantData.reviews?.length || 0})
        </Text>
        {mockRestaurantData.reviews && mockRestaurantData.reviews.length > 0 ? (
          <>
            {mockRestaurantData.reviews.map((item, index) => (
              <View key={item.id || index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    <Text style={styles.reviewUserName}>{item.userName}</Text>
                    <View style={styles.reviewRating}>
                      {[...Array(5)].map((_, starIndex) => (
                        <Text key={starIndex} style={styles.star}>
                          {starIndex < item.rating ? '⭐' : '☆'}
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
            ))}
          </>
        ) : (
          <View style={styles.noReviewsContainer}>
            <Text style={styles.noReviewsText}>Henüz yorum bulunmuyor</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderInfoTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Restoran Bilgileri</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText}>{mockRestaurantData.address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📞</Text>
          <Text style={styles.infoText}>{mockRestaurantData.phone}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏰</Text>
          <Text style={styles.infoText}>{mockRestaurantData.workingHours}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📝</Text>
          <Text style={styles.infoText}>{mockRestaurantData.description}</Text>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>✨ Özellikler</Text>
          <View style={styles.featuresContainer}>
            {mockRestaurantData.features?.map((feature, index) => (
              <View key={index} style={styles.featureTag}>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapTitle}>📍 Konum</Text>
          <Text style={styles.webMapText}>{mockRestaurantData.name}</Text>
          <Text style={styles.webMapAddress}>{mockRestaurantData.address}</Text>
          <TouchableOpacity style={styles.webMapButton}>
            <Text style={styles.webMapButtonText}>Haritada Gör</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
 
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mockRestaurantData.name}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareIcon}>♡</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <Image
            source={mockRestaurantData.image}
            style={styles.restaurantImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {mockRestaurantData.rating}</Text>
              <Text style={styles.reviewCount}>({mockRestaurantData.reviewCount})</Text>
            </View>
          </View>
        </View>

        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{mockRestaurantData.name}</Text>
          <Text style={styles.restaurantType}>{mockRestaurantData.type}</Text>
          <View style={styles.restaurantMeta}>
            <Text style={styles.metaText}>💰 {mockRestaurantData.priceRange}</Text>
            <Text style={styles.metaText}>🚚 {mockRestaurantData.deliveryTime}</Text>
            <Text style={styles.metaText}>📦 ₺{mockRestaurantData.minOrder}+ min</Text>
          </View>
        </View>

        {!mockRestaurantData.isSelfService && (
          <TouchableOpacity 
            style={styles.reservationButton}
            onPress={() => navigation.navigate('Reservation', { restaurant: mockRestaurantData })}
          >
            <Text style={styles.reservationButtonText}>📅 Rezervasyon Yap</Text>
          </TouchableOpacity>
        )}

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              🍽️ Menü
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              ⭐ Yorumlar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
              ℹ️ Bilgiler
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContentContainer}>
          {activeTab === 'menu' ? renderMenuTab() : 
           activeTab === 'reviews' ? renderReviewsTab() : 
           renderInfoTab()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}