import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { MenuItem } from './MenuItem';
import { useTheme } from '../../context/ThemeContext';

export const MenuTab = ({ restaurant, styles }) => {
  const { theme } = useTheme();
  
  const formatMenuData = (menuData) => {
    if (!menuData || !menuData.menuByCategory) return [];
    
    return Object.entries(menuData.menuByCategory).map(([categoryName, items], index) => ({
      id: `category-${index}`,
      name: categoryName,
      items: items || []
    }));
  };

  const formattedMenu = formatMenuData(restaurant.menu);
  
  return (
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
      {restaurant.loadingMenu ? (
        <View style={[styles.emptyState, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary || "#667eea"} />
          <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary, marginTop: 10 }]}>Menü yükleniyor...</Text>
        </View>
      ) : formattedMenu && formattedMenu.length > 0 ? (
        formattedMenu.map((category) => (
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