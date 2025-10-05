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

export default function OrdersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data - Backend'den gelecek
  const mockOrders = {
    active: [
      {
        id: 1,
        restaurantName: 'Günaydın Steakhouse',
        restaurantImage: require('../../assets/korean.jpeg'),
        orderNumber: '#12345',
        status: 'hazırlanıyor',
        statusText: 'Hazırlanıyor',
        orderTime: '14:30',
        estimatedTime: '15:00',
        total: 89.90,
        items: [
          { name: 'Izgara Biftek', quantity: 1, price: 89.90 }
        ],
        tableNumber: '15'
      },
      {
        id: 2,
        restaurantName: 'Pizza Palace',
        restaurantImage: require('../../assets/korean.jpeg'),
        orderNumber: '#12346',
        status: 'hazır',
        statusText: 'Hazır',
        orderTime: '13:45',
        estimatedTime: '14:15',
        total: 65.90,
        items: [
          { name: 'Margherita Pizza', quantity: 1, price: 45.90 },
          { name: 'Coca Cola', quantity: 2, price: 20.00 }
        ],
        tableNumber: '8'
      }
    ],
    completed: [
      {
        id: 3,
        restaurantName: 'Sushi Master',
        restaurantImage: require('../../assets/korean.jpeg'),
        orderNumber: '#12344',
        status: 'teslim_edildi',
        statusText: 'Teslim Edildi',
        orderTime: '12:00',
        completedTime: '12:45',
        total: 125.80,
        items: [
          { name: 'California Roll', quantity: 2, price: 85.80 },
          { name: 'Miso Soup', quantity: 1, price: 25.00 },
          { name: 'Green Tea', quantity: 1, price: 15.00 }
        ],
        tableNumber: '12',
        rating: 5
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'hazırlanıyor':
        return '#FF6B35';
      case 'hazır':
        return '#27AE60';
      case 'teslim_edildi':
        return '#7F8C8D';
      default:
        return '#7F8C8D';
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.statusText}</Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <Text style={styles.orderTime}>Sipariş: {item.orderTime}</Text>
        {item.estimatedTime && (
          <Text style={styles.estimatedTime}>Tahmini: {item.estimatedTime}</Text>
        )}
        {item.completedTime && (
          <Text style={styles.completedTime}>Tamamlandı: {item.completedTime}</Text>
        )}
        <Text style={styles.tableNumber}>Masa: {item.tableNumber}</Text>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{orderItem.name}</Text>
            <Text style={styles.itemQuantity}>x{orderItem.quantity}</Text>
            <Text style={styles.itemPrice}>₺{orderItem.price.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>Toplam: ₺{item.total.toFixed(2)}</Text>
        {item.status === 'hazır' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Siparişi Al</Text>
          </TouchableOpacity>
        )}
        {item.status === 'teslim_edildi' && !item.rating && (
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonText}>Değerlendir</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

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
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {renderTabButton('active', 'Aktif Siparişler')}
        {renderTabButton('completed', 'Geçmiş Siparişler')}
      </View>

      {/* Orders List */}
      <FlatList
        data={mockOrders[activeTab]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>
              {activeTab === 'active' ? 'Aktif siparişiniz yok' : 'Geçmiş siparişiniz yok'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'active' 
                ? 'Henüz aktif bir siparişiniz bulunmuyor' 
                : 'Daha önce verdiğiniz siparişler burada görünecek'
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
  orderCard: {
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
  orderHeader: {
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
  orderNumber: {
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
  orderDetails: {
    marginBottom: 15,
  },
  orderTime: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#FF6B35',
    marginBottom: 5,
  },
  completedTime: {
    fontSize: 14,
    color: '#27AE60',
    marginBottom: 5,
  },
  tableNumber: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  itemsContainer: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#7F8C8D',
    marginHorizontal: 10,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingTop: 15,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  actionButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rateButton: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rateButtonText: {
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
