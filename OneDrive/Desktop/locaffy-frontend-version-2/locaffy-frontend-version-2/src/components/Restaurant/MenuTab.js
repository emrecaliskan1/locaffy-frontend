import React from 'react';
import {
  View,
  Text,
  FlatList,
} from 'react-native';
import { MenuItem } from './MenuItem';

export const MenuTab = ({ restaurant, styles }) => (
  <View style={styles.tabContent}>
    {restaurant.menu.categories.map((category) => (
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
    ))}
  </View>
);