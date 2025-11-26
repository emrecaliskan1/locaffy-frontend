import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const ReviewItem = ({ item, index, styles }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Geçersiz tarih';
    }
  };

  return (
    <View key={item.id || index} style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <Text style={styles.reviewUserName}>
            {item.user?.username || item.userName || 'Anonim Kullanıcı'}
          </Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, starIndex) => (
              <FontAwesome 
                key={starIndex}
                name={starIndex < item.rating ? 'star' : 'star-o'}
                size={16}
                color={starIndex < item.rating ? '#F39C12' : '#BDC3C7'}
                style={styles.starIcon}
              />
            ))}
          </View>
        </View>
        <Text style={styles.reviewDate}>
          {formatDate(item.createdAt || item.date)}
        </Text>
      </View>
      {item.comment && (
        <Text style={styles.reviewComment}>{item.comment}</Text>
      )}
    </View>
  );
};