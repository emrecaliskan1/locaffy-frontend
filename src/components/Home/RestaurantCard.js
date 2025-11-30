import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { userService } from '../../services';

export const RestaurantCard = ({ item, onPress, favoritesList = [], onFavoriteChange, onShowToast, styles }) => {
  const { theme } = useTheme();
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  
  const isFavorite = favoritesList.some(fav => fav.id === item.id);

  // Mekanın şu an açık/kapalı olup olmadığını kontrol et
  const getRestaurantStatus = () => {
    if (!item.workingDays || !item.openingHours) {
      return { isOpen: false, text: 'Bilgi Yok' };
    }
    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const dayMap = {
      'PAZAR': 0, 'PAZARTESİ': 1, 'SALI': 2, 'ÇARŞAMBA': 3, 
      'PERŞEMBE': 4, 'CUMA': 5, 'CUMARTESİ': 6,
      // Eski format (geriye dönük uyumluluk)
      'Pazar': 0, 'Pazartesi': 1, 'Salı': 2, 'Çarşamba': 3, 
      'Perşembe': 4, 'Cuma': 5, 'Cumartesi': 6
    };

    let workingDayNumbers = [];
    const workingDays = item.workingDays.trim();
    
    if (workingDays.includes('-')) {
      const [startDay, endDay] = workingDays.split('-').map(day => day.trim());
      const startDayNum = dayMap[startDay];
      const endDayNum = dayMap[endDay];
      
      if (startDayNum !== undefined && endDayNum !== undefined) {
        // Pazartesi-Cuma gibi aralık varsa
        if (startDayNum <= endDayNum) {
          for (let i = startDayNum; i <= endDayNum; i++) {
            workingDayNumbers.push(i);
          }
        } else {
          for (let i = startDayNum; i <= 6; i++) {
            workingDayNumbers.push(i);
          }
          for (let i = 0; i <= endDayNum; i++) {
            workingDayNumbers.push(i);
          }
        }
      }
    } else if (workingDays.includes(',')) {
      const days = workingDays.split(',').map(day => day.trim());
      workingDayNumbers = days.map(day => dayMap[day]).filter(num => num !== undefined);
    } else if (workingDays === 'PAZARTESİ,SALI,ÇARŞAMBA,PERŞEMBE,CUMA,CUMARTESİ,PAZAR' || 
               workingDays === 'Pazartesi-Pazar' || 
               workingDays === 'Hergün') {
      workingDayNumbers = [0, 1, 2, 3, 4, 5, 6];
    } else {
      const dayNum = dayMap[workingDays];
      if (dayNum !== undefined) {
        workingDayNumbers = [dayNum];
      }
    }
    if (!workingDayNumbers.includes(currentDay)) {
      return { isOpen: false, text: 'Kapalı' };
    }
    return { isOpen: true, text: 'Açık' };
  };

  const restaurantStatus = getRestaurantStatus();

  // Favori toggle fonksiyonu
  const handleFavoriteToggle = async (e) => {
    e.stopPropagation(); 
    
    if (favoriteLoading) return;
    
    try {
      setFavoriteLoading(true);
      
      if (isFavorite) {
        await userService.removeFromFavorites(item.id);
        if (onShowToast) {
          onShowToast('Mekan favorilerden çıkarıldı', 'success');
        }
      } else {
        await userService.addToFavorites(item.id);
        if (onShowToast) {
          onShowToast('Mekan favorilere eklendi', 'success');
        }
      }
      
      if (onFavoriteChange) {
        onFavoriteChange();
      }
    } catch (error) {
      console.log('Error toggling favorite:', error);
      if (onShowToast) {
        onShowToast(error.message || 'Favori işlemi gerçekleştirilemedi', 'error');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };
  
  return (
    <TouchableOpacity 
      style={[styles.restaurantCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => onPress(item)}>

      <View style={styles.cardImageContainer}>
        <Image 
          source={item.mainImageUrl ? { uri: item.mainImageUrl } : require('../../../assets/icon.png')} 
          style={styles.cardImage} 
        />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={handleFavoriteToggle}
          disabled={favoriteLoading}
        >
          {favoriteLoading ? (
            <ActivityIndicator size="small" color="#E74C3C" />
          ) : (
            <FontAwesome 
              name={isFavorite ? "heart" : "heart-o"} 
              size={16} 
              color={isFavorite ? "#E74C3C" : "#95A5A6"} 
              style={styles.favoriteIcon} 
            />
          )}
        </TouchableOpacity>

        <View style={[styles.statusBadge, { 
          backgroundColor: restaurantStatus.isOpen ? '#27AE60' : '#E74C3C' 
        }]}>
          <Text style={styles.statusText}>{restaurantStatus.text}</Text>
        </View>
      </View>
      
      {/*Kartların Üzerindeki Mekan Bilgileri */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={[styles.restaurantName, { color: theme.colors.text }]}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={12} color="#FFD700" style={styles.ratingIcon} />
            <Text style={[styles.rating, { color: theme.colors.text }]}>{item.averageRating ? item.averageRating.toFixed(1) : '0.0'}</Text>
            <Text style={[styles.reviews, { color: theme.colors.textSecondary }]}>({item.totalRatings || 0})</Text>
          </View>
        </View>
        
        <Text style={[styles.restaurantType, { color: theme.colors.textSecondary }]}>{item.placeType}</Text>
        
        <View style={styles.cardFooter}>
          <View style={styles.infoItem}>
            <FontAwesome name="map-marker" size={12} color="#95A5A6" style={styles.infoIcon} />
            <Text 
              style={[styles.infoText, { color: theme.colors.textTertiary, flex: 1 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.address}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <FontAwesome name="clock-o" size={12} color="#95A5A6" style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: theme.colors.textTertiary }]}>{item.openingHours}</Text>
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};