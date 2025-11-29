import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export const MenuItem = ({ item, styles }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.menuItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.menuItemImage} />
      ) : (
        <View style={[styles.menuItemImage, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#999', fontSize: 12 }}>Fotoğraf yok</Text>
        </View>
      )}
      <View style={[styles.menuItemInfo, { backgroundColor: theme.colors.card }]}>
        <View style={[styles.menuItemHeader, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.menuItemName, { color: theme.colors.text }]}>{item.name}</Text>
          {item.isPopular && (
            <View style={[styles.popularBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.popularText, { color: '#FFFFFF' }]}>Popüler</Text>
            </View>
          )}
        </View>
        <Text style={[styles.menuItemDescription, { color: theme.colors.textSecondary }]}>{item.description}</Text>
        <Text style={[styles.menuItemPrice, { color: theme.colors.text, fontWeight: 'bold' }]}>₺{item.price.toFixed(2)}</Text>
      </View>
    </View>
  );
};