import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Switch
} from 'react-native';
import { useState } from 'react';
import { categories, distanceOptions, priceRanges, ratingOptions } from '../../static-data';
import { styles } from './styles';
import COLORS from '../../constants/colors';

export default function FilterModal({ visible, onClose, onApplyFilters }) {
  const [filters, setFilters] = useState({
    distance: '5',
    priceRange: 'all',
    rating: 'all',
    category: 'all',
    features: {
      selfService: false,
      reservation: false,
      card: false,
      cash: false
    }
  });

  const handleDistanceChange = (value) => {
    setFilters(prev => ({ ...prev, distance: value }));
  };

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, rating: value }));
  };

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }));
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
      category: 'all',
      features: {
        selfService: false,
        reservation: false,
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

          {/* Kategori */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kategori</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    filters.category === category.value && styles.activeCategoryButton
                  ]}
                  onPress={() => handleCategoryChange(category.value)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    filters.category === category.value && styles.activeCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Özellikler</Text>
            <View style={styles.featuresContainer}>
              {Object.entries(filters.features).map(([feature, value]) => (
                <View key={feature} style={styles.featureRow}>
                  <Text style={styles.featureLabel}>
                    {feature === 'selfService' && '🍽️ Self Servis'}
                    {feature === 'reservation' && '📅 Rezervasyon'}
                    {feature === 'card' && '💳 Kart Ödemesi'}
                    {feature === 'cash' && '💰 Nakit Ödeme'}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={() => handleFeatureToggle(feature)}
                    trackColor={{ false: '#E1E8ED', true: COLORS.PRIMARY }}
                    thumbColor={value ? COLORS.PRIMARY : '#FFFFFF'}
                    style={{ borderWidth: 1, borderColor: value ? COLORS.PRIMARY : '#E1E8ED' }}
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