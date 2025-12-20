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
import { ReviewItemModal } from './ReviewItemModal';

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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <TouchableOpacity 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }} 
          activeOpacity={1} 
          onPress={onClose}
        />
        <View style={{ 
          backgroundColor: theme.colors.background,
          marginHorizontal: 15,
          borderRadius: 15,
          width: '92%',
          maxHeight: '90%',
          minHeight: 580
        }}>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border
          }}>
            <TouchableOpacity 
              style={{
                backgroundColor: theme.colors.card,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center'
              }} 
              onPress={onClose}
            >
              <FontAwesome name="times" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {/* Restoran Görseli */}
            <View style={{ 
              height: 220, 
              backgroundColor: theme.colors.card,
              alignItems: 'center',
              justifyContent: 'center',
              marginHorizontal: 15,
              marginTop: 10,
              borderRadius: 10,
              overflow: 'hidden'
            }}>
              {getImageUrl() ? (
                <Image 
                  source={{ uri: getImageUrl() }} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    borderRadius: 10 
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: theme.colors.surface, 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>Resim Yok</Text>
                </View>
              )}
            </View>
            
            {/* Restoran Bilgileri */}
            <View style={{ padding: 15 }}>
        
              <Text style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: theme.colors.text,
                marginBottom: 8
              }}>{restaurant.name}</Text>
              
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
                  {[...Array(5)].map((_, index) => (
                    <FontAwesome
                      key={index}
                      name={index < Math.round(restaurant.averageRating || 0) ? "star" : "star-o"}
                      size={14}
                      color={index < Math.round(restaurant.averageRating || 0) ? "#F1C40F" : "#BDC3C7"}
                      style={{ marginRight: 2 }}
                    />
                  ))}
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
                      <ReviewItemModal key={review.id} review={review} />
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
          <View style={{
            padding: 15,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border
          }}>
            <TouchableOpacity 
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 15,
                borderRadius: 10,
                alignItems: 'center'
              }}
              onPress={() => {
                onClose();
                onViewDetails(restaurant);
              }}
            >
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600'
              }}>Detay Gör</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};