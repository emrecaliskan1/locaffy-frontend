import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles';
import { COLORS } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { id: 'all', name: 'Tümü', icon: 'th-large', iconType: 'fa' },
  { id: 'restaurant', name: 'Restoran', icon: 'cutlery', iconType: 'fa' },
  { id: 'cafe', name: 'Kafe', icon: 'coffee', iconType: 'fa' },
  { id: 'bar', name: 'Bar', icon: 'glass', iconType: 'fa' },
  { id: 'bistro', name: 'Bistro', icon: 'utensils', iconType: 'fa5' },
  { id: 'dessert', name: 'Tatlıcı', icon: 'birthday-cake', iconType: 'fa' },
  { id: 'fastfood', name: 'Fast Food', icon: 'hamburger', iconType: 'fa5' }
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
    category: 'all'
  });

  const handleRatingChange = (value) => {
    setFilters(prev => ({ ...prev, rating: value }));
  };

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    setFilters({
      rating: 'all',
      category: 'all'
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
        <View style={{ height: '75%', backgroundColor: theme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
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
                  {category.iconType === 'fa5' ? (
                    <FontAwesome5 
                      name={category.icon} 
                      size={20} 
                      color={theme.colors.primary}
                      style={styles.categoryIcon} 
                    />
                  ) : (
                    <FontAwesome 
                      name={category.icon} 
                      size={20} 
                      color={theme.colors.primary}
                      style={styles.categoryIcon} 
                    />
                  )}
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
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.border }]}>
          <TouchableOpacity style={[styles.applyButton, { backgroundColor: theme.colors.primary }]} onPress={handleApplyFilters}>
            <Text style={[styles.applyButtonText, { color: '#FFFFFF' }]}>Filtreleri Uygula</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;