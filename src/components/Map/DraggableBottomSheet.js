import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = 250;
const BOTTOM_SHEET_MIN_HEIGHT = 50;

export const DraggableBottomSheet = ({ restaurants, onMarkerPress, styles }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const toggleSheet = () => {
    const toValue = isExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
    
    Animated.spring(animatedHeight, {
      toValue,
      damping: 15,
      mass: 1,
      stiffness: 150,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: animatedHeight,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.bottomSheetHeader}
        onPress={toggleSheet}
        activeOpacity={0.8}
      >
        <View style={styles.bottomSheetHandle} />
        <Text style={styles.bottomSheetTitle}>Yakındaki Restoranlar</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <ScrollView 
          style={styles.restaurantScrollList} 
          showsVerticalScrollIndicator={false}
        >
          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantListItem}
              onPress={() => onMarkerPress(restaurant)}
            >
              <View style={styles.restaurantItemInfo}>
                <Text style={styles.restaurantItemName}>{restaurant.name}</Text>
                <Text style={styles.restaurantItemType}>{restaurant.type}</Text>
                <Text style={styles.restaurantItemRating}>⭐ {restaurant.rating}</Text>
                <Text style={styles.restaurantItemAddress}>{restaurant.address}</Text>
              </View>
              <View style={styles.restaurantItemRight}>
                <Text style={styles.restaurantItemIcon}>🍽️</Text>
                <Text style={styles.restaurantItemDistance}>{restaurant.distance}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </Animated.View>
  );
};