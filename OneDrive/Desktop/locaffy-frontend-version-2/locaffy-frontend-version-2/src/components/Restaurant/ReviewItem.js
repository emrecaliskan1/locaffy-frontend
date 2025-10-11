import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export const ReviewItem = ({ item, index, styles }) => (
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
);