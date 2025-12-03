import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocation } from '../../context/LocationContext';
import { useTheme } from '../../context/ThemeContext';
import { cities } from '../../constants/cities';
import { styles } from './styles';

export default function CitySelectionScreen({ navigation, route }) {
  const { selectCity, requestLocationPermission } = useLocation();
  const { theme } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  
  const isModal = route?.params?.isModal || false;

  // Şehirleri arama metnine göre filtrele
  const filteredCities = useMemo(() => {
    if (!searchText) return cities;
    return cities.filter(city =>
      city.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText]);

  const handleCitySelect = async (city) => {
    setLoading(true);
    try {
      const success = await selectCity(city);
      if (success) {
        if (isModal) {
          navigation.goBack();
        } else {
          navigation.replace('Main');
        }
      }
    } catch (error) {
      console.log('Şehir seçimi hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      const granted = await requestLocationPermission();
      if (granted) {
        if (isModal) {
          navigation.goBack();
        } else {
          navigation.replace('Main');
        }
      }
    } catch (error) {
      console.log('Konum izni hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.cityItem, { borderBottomColor: theme.colors.borderLight }]}
      onPress={() => handleCitySelect(item)}
      disabled={loading}
    >
      <View style={styles.cityInfo}>
        <FontAwesome name="map-marker" size={16} color="#667eea" />
        <Text style={[styles.cityName, { color: theme.colors.text }]}>{item.name}</Text>
      </View>
      <FontAwesome name="chevron-right" size={12} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          {isModal && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome name="times" size={20} color={theme.colors.text} />
            </TouchableOpacity>
          )}
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Şehir Seçin
          </Text>
        </View>

        {/* Location Permission Button */}
        <TouchableOpacity
          style={[styles.locationButton, { backgroundColor: '#667eea' }]}
          onPress={handleLocationPermission}
          disabled={loading}
        >
          <FontAwesome name="location-arrow" size={16} color="#fff" />
          <Text style={styles.locationButtonText}>Konumumu Kullan</Text>
          {loading && <ActivityIndicator size="small" color="#fff" style={{ marginLeft: 8 }} />}
        </TouchableOpacity>

        {/* Search Input */}
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <FontAwesome name="search" size={16} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Şehir arayın..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="words"
          />
        </View>

        {/* Cities List */}
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCityItem}
          style={[styles.list, { backgroundColor: theme.colors.card }]}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: 56,
            offset: 56 * index,
            index,
          })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Aranan şehir bulunamadı
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}