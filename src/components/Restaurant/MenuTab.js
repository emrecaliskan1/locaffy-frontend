import React from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { MenuItem } from './MenuItem';

export const MenuTab = ({ restaurant, styles }) => (
  <View style={styles.tabContent}>
    {restaurant.menu && restaurant.menu.length > 0 ? (
      restaurant.menu.map((category) => (
        <View key={category.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{category.name}</Text>
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
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>Henüz menü bilgisi eklenmemiş</Text>
        <Text style={styles.emptyStateSubtext}>Menü yakında eklenecek</Text>
      </View>
    )}
  </View>
);