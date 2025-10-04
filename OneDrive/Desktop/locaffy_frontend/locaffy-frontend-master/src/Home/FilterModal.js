import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Switch
} from 'react-native';
import { useState } from 'react';

export default function FilterModal({ visible, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    distance: '5',
    priceRange: 'all',
    rating: 'all',
    cuisine: 'all',
    features: {
      delivery: false,
      pickup: false,
      reservation: false,
      outdoor: false,
      parking: false,
      wifi: false,
      card: false,
      cash: false
    }
  });

  const distanceOptions = [
    { value: '1', label: '1 km' },
    { value: '3', label: '3 km' },
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '20', label: '20 km' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Hepsi' },
    { value: '1', label: '₺' },
    { value: '2', label: '₺₺' },
    { value: '3', label: '₺₺₺' },
    { value: '4', label: '₺₺₺₺' }
  ];

  const ratingOptions = [
    { value: 'all', label: 'Hepsi' },
    { value: '4.5', label: '4.5+ ⭐' },
    { value: '4.0', label: '4.0+ ⭐' },
    { value: '3.5', label: '3.5+ ⭐' },
    { value: '3.0', label: '3.0+ ⭐' }
  ];

  const cuisineTypes = [
    { value: 'all', label: 'Hepsi' },
    { value: 'turkish', label: 'Türk' },
    { value: 'italian', label: 'İtalyan' },
    { value: 'chinese', label: 'Çin' },
    { value: 'japanese', label: 'Japon' },
    { value: 'mexican', label: 'Meksika' },
    { value: 'indian', label: 'Hint' },
    { value: 'fastfood', label: 'Fast Food' }
  ];

  const handleDistanceChange = (value) => {
    setFilters(prev => ({ ...prev, distance: value }));
  };

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, rating: value }));
  };

  const handleCuisineChange = (value) => {
    setFilters(prev => ({ ...prev, cuisine: value }));
  };

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      distance: '5',
      priceRange: 'all',
      rating: 'all',
      cuisine: 'all',
      features: {
        delivery: false,
        pickup: false,
        reservation: false,
        outdoor: false,
        parking: false,
        wifi: false,
        card: false,
        cash: false
      }
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>İptal</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Filtreler</Text>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
            <Text style={styles.resetText}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Mesafe */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mesafe</Text>
            <View style={styles.optionsContainer}>
              {distanceOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    filters.distance === option.value && styles.activeOptionButton
                  ]}
                  onPress={() => handleDistanceChange(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    filters.distance === option.value && styles.activeOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Fiyat Aralığı */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fiyat Aralığı</Text>
            <View style={styles.optionsContainer}>
              {priceRanges.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    filters.priceRange === option.value && styles.activeOptionButton
                  ]}
                  onPress={() => handlePriceChange(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    filters.priceRange === option.value && styles.activeOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Puan */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Puan</Text>
            <View style={styles.optionsContainer}>
              {ratingOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    filters.rating === option.value && styles.activeOptionButton
                  ]}
                  onPress={() => handleRatingChange(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    filters.rating === option.value && styles.activeOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Mutfak Türü */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mutfak Türü</Text>
            <View style={styles.optionsContainer}>
              {cuisineTypes.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    filters.cuisine === option.value && styles.activeOptionButton
                  ]}
                  onPress={() => handleCuisineChange(option.value)}
                >
                  <Text style={[
                    styles.optionText,
                    filters.cuisine === option.value && styles.activeOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Özellikler */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Özellikler</Text>
            <View style={styles.featuresContainer}>
              {Object.entries(filters.features).map(([feature, value]) => (
                <View key={feature} style={styles.featureRow}>
                  <Text style={styles.featureLabel}>
                    {feature === 'delivery' && '🚚 Teslimat'}
                    {feature === 'pickup' && '📦 Paket Servis'}
                    {feature === 'reservation' && '📅 Rezervasyon'}
                    {feature === 'outdoor' && '🌳 Açık Alan'}
                    {feature === 'parking' && '🅿️ Otopark'}
                    {feature === 'wifi' && '📶 WiFi'}
                    {feature === 'card' && '💳 Kart Ödemesi'}
                    {feature === 'cash' && '💰 Nakit Ödeme'}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={() => handleFeatureToggle(feature)}
                    trackColor={{ false: '#E1E8ED', true: '#FF6B35' }}
                    thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Filtreleri Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  resetButton: {
    padding: 8,
  },
  resetText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  activeOptionButton: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  optionText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  activeOptionText: {
    color: '#FFFFFF',
  },
  featuresContainer: {
    gap: 15,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureLabel: {
    fontSize: 16,
    color: '#2C3E50',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  applyButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
