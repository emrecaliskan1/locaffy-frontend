import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

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