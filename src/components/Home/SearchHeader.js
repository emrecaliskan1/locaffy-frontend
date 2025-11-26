import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export const SearchHeader = ({ 
  searchText, 
  onSearchChange, 
  onFilterPress,
  onFocus,
  onBlur,
  styles 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchBar, { backgroundColor: '#FFFFFF', borderColor: '#E0E0E0' }]}>
        <Text style={[styles.searchIcon, { color: '#999999' }]}><FontAwesome name="search"/></Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: '#FFFFFF', color: '#000000' }]}
          placeholder="Mekan veya dilediğin yemeği ara..."
          value={searchText}
          onChangeText={onSearchChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholderTextColor="#999999"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: '#FFFFFF' }]}
          onPress={onFilterPress}
        >
          <FontAwesome name="sliders" size={16} color="#667eea" style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};