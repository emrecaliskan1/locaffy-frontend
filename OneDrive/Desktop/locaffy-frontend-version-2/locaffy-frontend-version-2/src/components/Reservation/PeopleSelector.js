import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export const PeopleSelector = ({ 
  maxPeople, 
  selectedPeople, 
  onPeopleSelect, 
  styles 
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
      <Text style={styles.sectionTitle}>👥 Kişi Sayısı</Text>
      <View style={styles.peopleContainer}>
        {Array.from({ length: maxPeople }, (_, i) => i + 1).map(renderPeopleOption)}
      </View>
    </View>
  );
};