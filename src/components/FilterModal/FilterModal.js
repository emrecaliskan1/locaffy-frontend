import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { categories, distanceOptions, priceRanges, ratingOptions } from '../../static-data';
import { styles } from './styles';
import { COLORS } from '../../constants/colors';

const FilterModal = ({ visible, onClose, onApplyFilters }) => {
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
      <SafeAreaView style={styles.container} edges={['top']}>
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
                  <View style={styles.ratingOptionContainer}>
                    <Text style={[
                      styles.optionText,
                      filters.rating === option.value && styles.activeOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {option.icon && (
                      <FontAwesome 
                        name={option.icon} 
                        size={14} 
                        color={filters.rating === option.value ? "#FFFFFF" : "#F39C12"} 
                        style={styles.ratingIcon}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
                  {(() => {
                    const iconColor = filters.category === category.value ? "#667eea" : "#667eea";
                    
                    // Eğer iconType yoksa (emoji ise), direkt emoji olarak göster
                    if (!category.iconType) {
                      return <Text style={[styles.categoryIcon, { fontSize: 16 }]}>{category.icon}</Text>;
                    }
                    
                    switch (category.iconType) {
                      case 'MaterialIcons':
                        return <MaterialIcons name={category.icon} size={16} color={iconColor} style={styles.categoryIcon} />;
                      case 'MaterialCommunityIcons':
                        return <MaterialCommunityIcons name={category.icon} size={16} color={iconColor} style={styles.categoryIcon} />;
                      case 'FontAwesome':
                      default:
                        return <FontAwesome name={category.icon} size={16} color={iconColor} style={styles.categoryIcon} />;
                    }
                  })()}
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
                  <View style={styles.featureLabelContainer}>
                    {feature === 'selfService' && <FontAwesome name="cutlery" size={16} color="#667eea" style={styles.featureIcon} />}
                    {feature === 'reservation' && <FontAwesome name="calendar" size={16} color="#667eea" style={styles.featureIcon} />}
                    {feature === 'card' && <FontAwesome name="credit-card" size={16} color="#667eea" style={styles.featureIcon} />}
                    {feature === 'cash' && <FontAwesome name="money" size={16} color="#667eea" style={styles.featureIcon} />}
                    <Text style={styles.featureLabel}>
                      {feature === 'selfService' && ' Self Servis'}
                      {feature === 'reservation' && ' Rezervasyon'}
                      {feature === 'card' && ' Kart Ödemesi'}
                      {feature === 'cash' && ' Nakit Ödeme'}
                    </Text>
                  </View>
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

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
            <Text style={styles.applyButtonText}>Filtreleri Uygula</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterModal;