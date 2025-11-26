import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const TabButtons = ({ activeTab, setActiveTab, styles }) => {
  const { theme } = useTheme();
  
  const renderTabButton = (tabId, tabName) => (
    <TouchableOpacity
      key={tabId}
      style={[
        styles.tabButton, 
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        activeTab === tabId && { backgroundColor: theme.colors.primary }
      ]}
      onPress={() => setActiveTab(tabId)}
    >
      <Text style={[
        styles.tabText, 
        { color: activeTab === tabId ? '#FFFFFF' : theme.colors.text }
      ]}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.colors.background }]}>
      {renderTabButton('active', 'Aktif Rezervasyonlar')}
      {renderTabButton('completed', 'Geçmiş Rezervasyonlar')}
    </View>
  );
};

export default TabButtons;