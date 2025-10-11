import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TabButtons = ({ activeTab, setActiveTab, styles }) => {
  const renderTabButton = (tabId, tabName) => (
    <TouchableOpacity
      key={tabId}
      style={[styles.tabButton, activeTab === tabId && styles.activeTabButton]}
      onPress={() => setActiveTab(tabId)}
    >
      <Text style={[styles.tabText, activeTab === tabId && styles.activeTabText]}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tabContainer}>
      {renderTabButton('active', 'Aktif Rezervasyonlar')}
      {renderTabButton('completed', 'Geçmiş Rezervasyonlar')}
    </View>
  );
};

export default TabButtons;