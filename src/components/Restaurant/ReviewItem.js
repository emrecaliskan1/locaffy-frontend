import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const ReviewItem = ({ item, index, styles }) => {
  const [userName, setUserName] = useState('Kullanıcı');

  // UserId'den username'i çek
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (item.username) {
          setUserName(item.username);
          return;
        }
        if (item.user?.username) {
          setUserName(item.user.username);
          return;
        }
        if (item.user?.name) {
          setUserName(item.user.name);
          return;
        }
        if (item.userName) {
          setUserName(item.userName);
          return;
        }
      } catch (error) {
        setUserName('Kullanıcı');
      }
    };
    fetchUserName();
  }, [item.username, item.user?.username, item.userName]);

  const formatDate = (dateString) => {
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
            {userName}
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