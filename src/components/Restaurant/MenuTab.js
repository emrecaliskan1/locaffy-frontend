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
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background, paddingTop: 20 }]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text, paddingHorizontal: 12, fontSize: 22 }]}>Menü</Text>
      {restaurant.loadingMenu ? (
        <View style={[{ backgroundColor: theme.colors.background, padding: 40, alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary || "#667eea"} />
          <Text style={[{ color: theme.colors.textSecondary, marginTop: 10 }]}>Menü yükleniyor...</Text>
        </View>
      ) : formattedMenu && formattedMenu.length > 0 ? (
        formattedMenu.map((category) => (
          <View key={category.id} style={[styles.section, { backgroundColor: theme.colors.background, marginBottom: 10 }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text, fontSize: 18, paddingHorizontal: 12 }]}>{category.name}</Text>
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
        <View style={[{ backgroundColor: theme.colors.background, padding: 40, alignItems: 'center' }]}>
          <Text style={[{ color: theme.colors.textSecondary, fontSize: 16 }]}>Henüz menü bilgisi eklenmemiş</Text>
          <Text style={[{ color: theme.colors.textTertiary, fontSize: 14, marginTop: 5 }]}>Menü yakında eklenecek</Text>
        </View>
      )}
    </View>
  );
};