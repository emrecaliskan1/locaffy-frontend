import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export const TimeSelector = ({ 
  availableTimes, 
  selectedTime, 
  selectedDate,
  onTimeSelect, 
  styles,
  theme
}) => {
  const renderTimeSlot = (time) => {
    const isSelected = selectedTime === time;
    let isDisabled = false;
    if (selectedDate) {
      const today = new Date();
      const sel = new Date(selectedDate);
      if (sel.toDateString() === today.toDateString()) {
        const [h, m] = time.split(':').map(Number);
        const slot = new Date();
        slot.setHours(h, m, 0, 0);
        if (slot.getTime() <= Date.now()) {
          isDisabled = true;
        }
      }
    }
    
    return (
      <TouchableOpacity
        key={time}
        style={[styles.timeSlot, isSelected && styles.selectedTimeSlot, isDisabled && styles.disabledTimeSlot]}
        onPress={() => !isDisabled && onTimeSelect(time)}
      >
        <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
          {time}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.section}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
        <FontAwesome name="clock-o" size={20} color={theme?.colors?.primary || '#667eea'} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Saat Seçin</Text>
      </View>
      <View style={styles.timesContainer}>
        {availableTimes.map(renderTimeSlot)}
      </View>
    </View>
  );
};