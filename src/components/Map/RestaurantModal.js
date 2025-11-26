import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  Animated,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getRestaurantIconComponent } from '../../utils/restaurantIcons';
import { useTheme } from '../../context/ThemeContext';
import { reviewService } from '../../services/reviewService';

export const RestaurantModal = ({ visible, restaurant, onClose, onViewDetails, styles }) => {
  const { theme } = useTheme();
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [reviewsAnimation] = useState(new Animated.Value(0));
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (restaurant && restaurant.id) {
      loadReviews();
    }
  }, [restaurant]);
  
  if (!restaurant) return null;

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const reviewsData = await reviewService.getPlaceReviews(restaurant.id);
      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Reviews loading error:', error);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };


  const getImageUrl = () => {
    if (restaurant.mainImageUrl) {
      return restaurant.mainImageUrl;
    }
    if (restaurant.imageUrl) {
      if (restaurant.imageUrl.startsWith('http')) {
        return restaurant.imageUrl;
      }
      return `${process.env.EXPO_PUBLIC_API_BASE_URL}${restaurant.imageUrl}`;
    }
    return null;
  };

  const toggleReviews = () => {
    if (reviewsExpanded) {
      Animated.timing(reviewsAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setReviewsExpanded(false));
    } else {
      setReviewsExpanded(true);
      Animated.timing(reviewsAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FontAwesome
        key={index}
        name={index < rating ? "star" : "star-o"}
        size={12}
        color={"#F1C40F"}
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <TouchableOpacity 
          style={styles.modalBackdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={[styles.modalContent, { 
          backgroundColor: theme.colors.background,
          marginHorizontal: 20,
          marginVertical: 20,
          borderRadius: 15,
          maxHeight: '75%'
        }]}>
          {/* Header with close button */}
          <View style={[styles.modalHeader, {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
          }]}>
            <View />
            <TouchableOpacity 
              style={[styles.modalCloseButton, {
                backgroundColor: theme.colors.card,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center'
              }]} 
              onPress={onClose}
            >
              <FontAwesome name="times" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Restoran Görseli */}
            <View style={{ 
              height: 200, 
              backgroundColor: theme.colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 15,
              marginTop: 10,
              borderRadius: 10
            }}>
              <Image 
                source={getImageUrl() ? { uri: getImageUrl() } : require('../../../assets/icon.png')} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: 10 
                }}
                resizeMode="cover"
              />
            </View>
            
            {/* Restoran Bilgileri */}
            <View style={{ padding: 20 }}>
        
              <Text style={[styles.modalRestaurantName, {
                fontSize: 24,
                fontWeight: 'bold',
                color: theme.colors.text,
                marginBottom: 8
              }]}>{restaurant.name}</Text>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12
              }}>
                <FontAwesome name="map-marker" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={{
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  flex: 1
                }}>{restaurant.address || 'Adres bilgisi mevcut değil'}</Text>
              </View>
              
              {/* Rating */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15
              }}>
                <View style={{ flexDirection: 'row', marginRight: 8 }}>
                  {renderStars(Math.round(restaurant.averageRating || 0))}
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.colors.text,
                  marginRight: 5
                }}>
                  {restaurant.averageRating ? restaurant.averageRating.toFixed(1) : '0.0'}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: theme.colors.textSecondary
                }}>({restaurant.reviewCount || reviews.length || 0} değerlendirme)</Text>
              </View>
              
              {/* İnceleme Açılır menüsü */}
              <TouchableOpacity 
                onPress={toggleReviews}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderTopWidth: 1,
                  borderBottomWidth: reviewsExpanded ? 0 : 1,
                  borderColor: theme.colors.border
                }}
              >
                <FontAwesome name="comment-o" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={{
                  fontSize: 16,
                  color: theme.colors.text,
                  flex: 1
                }}>Değerlendirmeleri Gör ({reviews.length})</Text>
                <FontAwesome 
                  name={reviewsExpanded ? "chevron-up" : "chevron-down"} 
                  size={14} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
              
              {/* İnceleme Listesi */}
              {reviewsExpanded && (
                <Animated.View style={{
                  opacity: reviewsAnimation,
                  borderBottomWidth: 1,
                  borderColor: theme.colors.border,
                  paddingBottom: 15
                }}>
                  {reviewsLoading ? (
                    <View style={{
                      alignItems: 'center',
                      paddingVertical: 20
                    }}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <Text style={{
                        color: theme.colors.textSecondary,
                        marginTop: 8,
                        fontSize: 14
                      }}>Yorumlar yükleniyor...</Text>
                    </View>
                  ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                      <View key={review.id} style={{
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.border + '40'
                      }}>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 5
                        }}>
                          <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text
                          }}>{review.user?.username || review.user?.firstName || 'Anonim'}</Text>
                          <View style={{ flexDirection: 'row' }}>
                            {renderStars(review.rating)}
                          </View>
                        </View>
                        <Text style={{
                          fontSize: 14,
                          color: theme.colors.text,
                          marginBottom: 5,
                          lineHeight: 20
                        }}>{review.comment}</Text>
                        <Text style={{
                          fontSize: 12,
                          color: theme.colors.textSecondary
                        }}>{new Date(review.createdAt).toLocaleDateString('tr-TR')}</Text>
                      </View>
                    ))
                  ) : (
                    <View style={{
                      alignItems: 'center',
                      paddingVertical: 20
                    }}>
                      <Text style={{
                        color: theme.colors.textSecondary,
                        fontSize: 14
                      }}>Henüz değerlendirme yapılmamış</Text>
                    </View>
                  )}
                </Animated.View>
              )}
              
              {/* Opening Hours */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 15
              }}>
                <FontAwesome name="clock-o" size={16} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={{
                  fontSize: 14,
                  color: theme.colors.text
                }}>Açılış Saati: {restaurant.openingHours || '09:00 - 22:00'}</Text>
              </View>
            </View>
          </ScrollView>
          
          {/* Action Button */}
          <View style={[styles.modalActions, {
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border
          }]}>
            <TouchableOpacity 
              style={[styles.modalDetailButton, {
                backgroundColor: theme.colors.primary,
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: 'center'
              }]}
              onPress={() => {
                onClose();
                onViewDetails(restaurant);
              }}
            >
              <Text style={[styles.modalDetailButtonText, {
                color: '#fff',
                fontSize: 16,
                fontWeight: '600'
              }]}>Detay Gör</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};