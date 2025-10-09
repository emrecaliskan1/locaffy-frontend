import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import { ReviewItem } from './ReviewItem';

export const ReviewsTab = ({ restaurant, styles }) => (
  <View style={styles.tabContent}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        Müşteri Yorumları ({restaurant.reviews?.length || 0})
      </Text>
      {restaurant.reviews && restaurant.reviews.length > 0 ? (
        <>
          {restaurant.reviews.map((item, index) => (
            <ReviewItem key={item.id || index} item={item} index={index} styles={styles} />
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