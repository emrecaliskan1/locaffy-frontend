import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getRestaurantIconComponent } from '../../utils/restaurantIcons';
import { useTheme } from '../../context/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = 250;
const BOTTOM_SHEET_MIN_HEIGHT = 50;

export const DraggableBottomSheet = ({ restaurants, onMarkerPress, styles, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
  const { theme } = useTheme();

  // Alt sayfa açma/kapatma fonksiyonu
  const toggleSheet = () => {
    const toValue = isExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
    Animated.spring(animatedHeight, {
      toValue,
      damping: 15,
      mass: 1,
      stiffness: 150,
      useNativeDriver: false,
    }).start();
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggle) {
      onToggle(newExpandedState);
    }
  };

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: animatedHeight,
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity 
        style={[styles.bottomSheetHeader, { backgroundColor: theme.colors.card }]}
        onPress={toggleSheet}
        activeOpacity={0.8}
      >
        <View style={[styles.bottomSheetHandle, { backgroundColor: theme.colors.border }]} />
        <Text style={[styles.bottomSheetTitle, { color: theme.colors.text }]}>Yakındaki Mekanlar</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <ScrollView 
          style={[styles.restaurantScrollList, { backgroundColor: theme.colors.card }]} 
          showsVerticalScrollIndicator={false}
        >
          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={[styles.restaurantListItem, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
              onPress={() => onMarkerPress(restaurant)}
            >
              <View style={[styles.restaurantItemInfo, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.restaurantItemName, { color: theme.colors.text }]}>{restaurant.name}</Text>
                <Text style={[styles.restaurantItemType, { color: theme.colors.textSecondary }]}>{restaurant.placeType}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome name="star" size={14} color="#F1C40F" style={{ marginRight: 4 }} />
                  <Text style={[styles.restaurantItemRating, { color: theme.colors.text }]}>{restaurant.averageRating || '0.0'}</Text>
                </View>
                <Text style={[styles.restaurantItemAddress, { color: theme.colors.textTertiary }]}>{restaurant.address}</Text>
              </View>
              <View style={[styles.restaurantItemRight, { backgroundColor: theme.colors.background }]}>
                <View style={styles.restaurantItemIcon}>
                  {getRestaurantIconComponent(restaurant.placeType, 18, theme.colors.primary)}
                </View>
                <Text style={[styles.restaurantItemDistance, { color: theme.colors.textSecondary }]}>
                  {restaurant.distance ? `${(restaurant.distance / 1000).toFixed(1)} km` : 'Yakın'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};