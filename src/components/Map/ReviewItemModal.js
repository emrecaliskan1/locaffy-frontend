import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const ReviewItemModal = ({ review }) => {
  const [userName, setUserName] = useState('Kullanıcı');
  const { theme } = useTheme();

  // UserId'den username'i çek
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        if (review.username) {
          setUserName(review.username);
          return;
        }
        if (review.user?.username) {
          setUserName(review.user.username);
          return;
        }
        if (review.user?.name) {
          setUserName(review.user.name);
          return;
        }
        if (review.user?.firstName) {
          setUserName(review.user.firstName);
          return;
        }
        if (review.userName) {
          setUserName(review.userName);
          return;
        }
      } catch (error) {
        setUserName('Kullanıcı');
      }
    };
    fetchUserName();
  }, [review.username, review.user?.username, review.userName, review.user?.firstName]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FontAwesome
        key={index}
        name={index < rating ? 'star' : 'star-o'}
        size={14}
        color={index < rating ? '#F1C40F' : '#BDC3C7'}
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <View style={{
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
        }}>{userName}</Text>
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
  );
};