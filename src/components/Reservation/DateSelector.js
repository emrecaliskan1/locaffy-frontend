import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { dayNames, monthNames } from '../../static-data';

export const DateSelector = ({ 
  availableDates, 
  selectedDate, 
  onDateSelect, 
  styles,
  theme
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    return {
      day: date.getDate(),
      dayName: dayNames[date.getDay()],
      month: monthNames[date.getMonth()],
      full: `${date.getDate()} ${monthNames[date.getMonth()]}`
    };
  };

  const renderDateItem = (dateString) => {
    const date = formatDate(dateString);
    const isSelected = selectedDate === dateString;
    const today = new Date();
    const isToday = (new Date(dateString).toDateString() === today.toDateString());

    return (
      <TouchableOpacity
        key={dateString}
        style={[styles.dateItem, isSelected && styles.selectedDateItem, isToday && styles.todayDateItem]}
        onPress={() => onDateSelect(dateString)}
      >
        <Text style={[styles.dateDay, isSelected && styles.selectedDateText]}>
          {date.day}
        </Text>
        <Text style={[styles.dateMonth, isSelected && styles.selectedDateText]}>
          {date.dayName} · {date.month}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <FontAwesome name="calendar" size={20} color={theme?.colors?.primary || '#667eea'} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Tarih Seçin</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.datesContainer}
        contentContainerStyle={styles.datesContent}
      >
        {availableDates.map(renderDateItem)}
      </ScrollView>
    </View>
  );
};