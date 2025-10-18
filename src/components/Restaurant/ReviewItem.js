import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const ReviewItem = ({ item, index, styles }) => (
  <View key={item.id || index} style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <View style={styles.reviewUser}>
        <Text style={styles.reviewUserName}>{item.userName}</Text>
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
      <Text style={styles.reviewDate}>{item.date}</Text>
    </View>
    <Text style={styles.reviewComment}>{item.comment}</Text>
    <TouchableOpacity style={styles.helpfulButton}>
      <View style={styles.helpfulContent}>
        <FontAwesome name="thumbs-up" size={14} color="#27AE60" />
        <Text style={styles.helpfulText}> Yararlı ({item.helpful})</Text>
      </View>
    </TouchableOpacity>
  </View>
);