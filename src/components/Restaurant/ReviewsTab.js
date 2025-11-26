import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { ReviewItem } from './ReviewItem';
import { useTheme } from '../../context/ThemeContext';

export const ReviewsTab = ({ restaurant, styles }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Müşteri Yorumları ({restaurant.reviews?.length || 0})
        </Text>
        {restaurant.loadingReviews ? (
          <View style={[styles.noReviewsContainer, { paddingVertical: 40, backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.noReviewsText, { marginTop: 16, color: theme.colors.textSecondary }]}>Yorumlar yükleniyor...</Text>
          </View>
        ) : restaurant.reviews && restaurant.reviews.length > 0 ? (
          <>
            {restaurant.reviews.map((item, index) => (
              <ReviewItem key={item.id || index} item={item} index={index} styles={styles} />
            ))}
          </>
        ) : (
          <View style={[styles.noReviewsContainer, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.noReviewsText, { color: theme.colors.textSecondary }]}>Henüz yorum bulunmuyor</Text>
          </View>
        )}
      </View>
    </View>
  );
};