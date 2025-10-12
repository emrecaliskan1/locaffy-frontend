import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  FlatList
} from 'react-native';
import { styles } from './styles';
import { mockReservations } from '../../static-data';
import { ReservationCard, TabButtons, EmptyState } from '../../components/Reservations-Profile';

export default function ReservationsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('active');

  const renderReservationItem = ({ item }) => {
    return <ReservationCard item={item} styles={styles} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
        <View style={styles.placeholder} />
      </View>

      <TabButtons 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        styles={styles} 
      />

      <FlatList
        data={mockReservations[activeTab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <EmptyState activeTab={activeTab} styles={styles} />
        )}
      />
    </View>
  );
}