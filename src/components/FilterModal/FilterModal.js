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
import { styles } from './styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { id: 'all', name: 'Tümü', icon: 'th-large' },
  { id: 'restaurant', name: 'Restoran', icon: 'cutlery' },
  { id: 'cafe', name: 'Kafe', icon: 'coffee' },
  { id: 'bar', name: 'Bar', icon: 'glass' },
  { id: 'bistro', name: 'Bistro', icon: 'cutlery' }
];

const ratingOptions = [
  { value: 'all', label: 'Tüm Puanlar', showStar: false },
  { value: '4+', label: '4+', showStar: true },
  { value: '3+', label: '3+', showStar: true },
  { value: '2+', label: '2+', showStar: true }
];

const FilterModal = ({ visible, onClose, onApplyFilters }) => {
  const { theme } = useTheme();
  const [filters, setFilters] = useState({
    rating: 'all',
    category: 'all',
    features: {
      selfService: false,
      reservation: false,
      card: false,
      cash: false
    }
  });

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
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>İptal</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>Filtreler</Text>
          <TouchableOpacity onPress={handleResetFilters} style={styles.resetButton}>
            <Text style={[styles.resetText, { color: theme.colors.primary }]}>Sıfırla</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={[styles.content, { backgroundColor: theme.colors.background }]} showsVerticalScrollIndicator={false}>

          <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Minimum Puan</Text>
            <View style={styles.optionsContainer}>
              {ratingOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    { borderColor: filters.rating === option.value ? theme.colors.primary : theme.colors.border, borderWidth: filters.rating === option.value ? 3 : 1 },
                    filters.rating === option.value && styles.activeOptionButton
                  ]}
                  onPress={() => handleRatingChange(option.value)}
                >
                  <View style={[styles.ratingOptionContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                    <Text style={[
                      styles.optionText,
                      { color: filters.rating === option.value ? "#FFFFFF" : theme.colors.primary },
                      filters.rating === option.value && styles.activeOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {option.showStar && (
                      <FontAwesome
                        name="star"
                        size={14}
                        color="#F1C40F"
                        style={{ marginLeft: 5 }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Kategori</Text>
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    { borderColor: filters.category === category.id ? theme.colors.primary : theme.colors.border, borderWidth: filters.category === category.id ? 3 : 1 },
                    filters.category === category.id && styles.activeCategoryButton
                  ]}
                  onPress={() => handleCategoryChange(category.id)}
                >
                  <FontAwesome 
                    name={category.icon} 
                    size={16} 
                    color={theme.colors.primary}
                    style={styles.categoryIcon} 
                  />
                  <Text style={[
                    styles.categoryText,
                    { color: filters.category === category.id ? "#FFFFFF" : theme.colors.primary },
                    filters.category === category.id && styles.activeCategoryText
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Özellikler</Text>
            <View style={styles.featuresContainer}>
              {Object.entries(filters.features).map(([feature, value]) => (
                <View key={feature} style={[styles.featureRow, { borderBottomColor: theme.colors.border }]}>
                  <View style={styles.featureLabelContainer}>
                    {feature === 'selfService' && <FontAwesome name="cutlery" size={16} color="#667eea" style={styles.featureIcon} />}
                    {feature === 'reservation' && <FontAwesome name="calendar" size={16} color="#667eea" style={styles.featureIcon} />}
                    {feature === 'card' && <FontAwesome name="credit-card" size={16} color="#667eea" style={styles.featureIcon} />}
                    {feature === 'cash' && <FontAwesome name="money" size={16} color="#667eea" style={styles.featureIcon} />}
                    <Text style={[styles.featureLabel, { color: theme.colors.text }]}>
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

        <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.colors.primary }]} onPress={handleApplyFilters}>
            <Text style={[styles.applyButtonText, { color: '#FFFFFF' }]}>Filtreleri Uygula</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FilterModal;