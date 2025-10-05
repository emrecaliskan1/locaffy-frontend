import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  FlatList
} from 'react-native';
import { useState } from 'react';
import { styles } from './styles';
import { mockOrders } from '../../static-data';

export default function OrdersScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('active');

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
        
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('active', 'Aktif Siparişler')}
        {renderTabButton('completed', 'Geçmiş Siparişler')}
      </View>

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