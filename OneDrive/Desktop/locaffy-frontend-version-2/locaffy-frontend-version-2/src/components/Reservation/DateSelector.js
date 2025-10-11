import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { dayNames, monthNames } from '../../static-data';

export const DateSelector = ({ 
  availableDates, 
  selectedDate, 
  onDateSelect, 
  styles 
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
      <Text style={styles.sectionTitle}>📅 Tarih Seçin</Text>
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