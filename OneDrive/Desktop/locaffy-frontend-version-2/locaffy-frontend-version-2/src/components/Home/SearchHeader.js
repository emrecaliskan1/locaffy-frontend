import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {FontAwesome } from '@expo/vector-icons';

export const SearchHeader = ({ 
  searchText, 
  onSearchChange, 
  onFilterPress,
  onFocus,
  onBlur,
  styles 
}) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBar}>
      <Text style={styles.searchIcon}><FontAwesome name="search"/></Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Mekan veya dilediğin yemeği ara..."
        value={searchText}
        onChangeText={onSearchChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor="#95A5A6"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <TouchableOpacity 
        style={styles.filterButton}
        onPress={onFilterPress}
      >
        <Text style={styles.filterIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  </View>
);