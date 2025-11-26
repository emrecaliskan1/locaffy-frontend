import React from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { MenuItem } from './MenuItem';
import { useTheme } from '../../context/ThemeContext';

export const MenuTab = ({ restaurant, styles }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
      {restaurant.menu && restaurant.menu.length > 0 ? (
        restaurant.menu.map((category) => (
          <View key={category.id} style={[styles.section, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{category.name}</Text>
            <FlatList
              data={category.items}
              renderItem={({ item }) => (
                <MenuItem item={item} styles={styles} />
              )}
              scrollEnabled={false}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>
        ))
      ) : (
        <View style={[styles.emptyState, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>Henüz menü bilgisi eklenmemiş</Text>
          <Text style={[styles.emptyStateSubtext, { color: theme.colors.textTertiary }]}>Menü yakında eklenecek</Text>
        </View>
      )}
    </View>
  );
};