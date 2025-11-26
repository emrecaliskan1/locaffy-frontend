import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const ReviewItem = ({ item, index, styles }) => {
  const [userName, setUserName] = useState('Kullanıcı');
  const { theme } = useTheme();

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
    <View key={item.id || index} style={[styles.reviewItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.reviewHeader, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.reviewUser, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.reviewUserName, { color: theme.colors.text }]}>
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
        <Text style={[styles.reviewDate, { color: theme.colors.textTertiary }]}>
          {formatDate(item.createdAt || item.date)}
        </Text>
      </View>
      {item.comment && (
        <Text style={[styles.reviewComment, { color: theme.colors.textSecondary }]}>{item.comment}</Text>
      )}
    </View>
  );
};