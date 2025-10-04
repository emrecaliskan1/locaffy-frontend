import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  FlatList
} from 'react-native';
import { useState } from 'react';

export default function ReservationsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data - Backend'den gelecek
  const mockReservations = {
    active: [
      {
        id: 1,
        restaurantName: 'Günaydın Steakhouse',
        restaurantImage: require('../../assets/steakhouse.jpeg'),
        reservationNumber: '#R12345',
        status: 'onaylandı',
        statusText: 'Onaylandı',
        date: '2024-01-25',
        time: '19:30',
        people: 4,
        specialRequests: 'Pencere kenarı masa istiyoruz',
        phone: '+90 555 123 45 67'
      },
      {
        id: 2,
        restaurantName: 'Pizza Palace',
        restaurantImage: require('../../assets/korean.jpeg'),
        reservationNumber: '#R12346',
        status: 'beklemede',
        statusText: 'Beklemede',
        date: '2024-01-26',
        time: '20:00',
        people: 2,
        specialRequests: null,
        phone: '+90 555 123 45 67'
      }
    ],
    completed: [
      {
        id: 3,
        restaurantName: 'Sushi Master',
        restaurantImage: require('../../assets/korean.jpeg'),
        reservationNumber: '#R12344',
        status: 'tamamlandı',
        statusText: 'Tamamlandı',
        date: '2024-01-20',
        time: '18:30',
        people: 3,
        specialRequests: 'Vejetaryen seçenekler',
        phone: '+90 555 123 45 67',
        rating: 5
      },
      {
        id: 4,
        restaurantName: 'Günaydın Steakhouse',
        restaurantImage: require('../../assets/korean.jpeg'),
        reservationNumber: '#R12343',
        status: 'reddedildi',
        statusText: 'Reddedildi',
        date: '2024-01-18',
        time: '19:00',
        people: 6,
        specialRequests: null,
        phone: '+90 555 123 45 67'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'onaylandı':
        return '#27AE60';
      case 'beklemede':
        return '#FF6B35';
      case 'tamamlandı':
        return '#7F8C8D';
      case 'reddedildi':
        return '#E74C3C';
      default:
        return '#7F8C8D';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const months = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    
    return {
      day: date.getDate(),
      dayName: days[date.getDay()],
      month: months[date.getMonth()],
      full: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    };
  };

  const canCancelReservation = (reservation) => {
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const timeDiff = reservationDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff > 2; // 2 saat öncesine kadar iptal edilebilir
  };

  const renderReservationItem = ({ item }) => {
    const date = formatDate(item.date);
    
    return (
      <View style={styles.reservationCard}>
        <View style={styles.reservationHeader}>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.restaurantName}</Text>
            <Text style={styles.reservationNumber}>{item.reservationNumber}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.statusText}</Text>
          </View>
        </View>

        <View style={styles.reservationDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Tarih:</Text>
            <Text style={styles.detailValue}>{date.full} ({date.dayName})</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🕐 Saat:</Text>
            <Text style={styles.detailValue}>{item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>👥 Kişi:</Text>
            <Text style={styles.detailValue}>{item.people} kişi</Text>
          </View>
          {item.specialRequests && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>💬 Not:</Text>
              <Text style={styles.detailValue}>{item.specialRequests}</Text>
            </View>
          )}
        </View>

        <View style={styles.reservationFooter}>
          {item.status === 'onaylandı' && canCancelReservation(item) && (
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>İptal Et</Text>
            </TouchableOpacity>
          )}
          {item.status === 'tamamlandı' && !item.rating && (
            <TouchableOpacity style={styles.rateButton}>
              <Text style={styles.rateButtonText}>Değerlendir</Text>
            </TouchableOpacity>
          )}
          {item.status === 'onaylandı' && (
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>Ara</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderTabButton = (tabId, tabName) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tabId && styles.activeTabButton]}
      onPress={() => setActiveTab(tabId)}
    >
      <Text style={[styles.tabText, activeTab === tabId && styles.activeTabText]}>
        {tabName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rezervasyonlarım</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('active', 'Aktif Rezervasyonlar')}
        {renderTabButton('completed', 'Geçmiş Rezervasyonlar')}
      </View>

      {/* Reservations List */}
      <FlatList
        data={mockReservations[activeTab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReservationItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? 'Aktif rezervasyonunuz yok' : 'Geçmiş rezervasyonunuz yok'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? 'Henüz aktif bir rezervasyonunuz bulunmuyor' 
                : 'Daha önce yaptığınız rezervasyonlar burada görünecek'
              }
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 20,
  },
  reservationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  reservationNumber: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  reservationDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    width: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
  },
  reservationFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rateButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  callButton: {
    backgroundColor: '#3498DB',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
  },
});
