import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const PeopleSelector = ({ 
  maxPeople, 
  selectedPeople, 
  onPeopleSelect, 
  styles,
  theme
}) => {
  const renderPeopleOption = (people) => {
    const isSelected = selectedPeople === people;
    
    return (
      <TouchableOpacity
        key={people}
        style={[styles.peopleOption, isSelected && styles.selectedPeopleOption]}
        onPress={() => onPeopleSelect(people)}
      >
        <Text style={[styles.peopleText, isSelected && styles.selectedPeopleText]}>
          {people}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <FontAwesome name="users" size={20} color={theme?.colors?.primary || '#667eea'} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Kişi Sayısı</Text>
      </View>
      <View style={styles.peopleContainer}>
        {Array.from({ length: maxPeople }, (_, i) => i + 1).map(renderPeopleOption)}
      </View>
    </View>
  );
};