import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

export const MenuItem = ({ item, styles }) => (
  <View style={styles.menuItem}>
    <Image source={item.image} style={styles.menuItemImage} />
    <View style={styles.menuItemInfo}>
      <View style={styles.menuItemHeader}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        {item.isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Popüler</Text>
          </View>
        )}
      </View>
      <Text style={styles.menuItemDescription}>{item.description}</Text>
      <Text style={styles.menuItemPrice}>₺{item.price.toFixed(2)}</Text>
    </View>
  </View>
);