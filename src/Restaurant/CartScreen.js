import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  FlatList,
  TextInput,
  Image,
  Modal,
} from 'react-native';
import { useState } from 'react';

export default function CartScreen({ route, navigation }) {
  const { cart, restaurant } = route.params;
  const [cartItems, setCartItems] = useState(cart);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState(1);
  const [editingNote, setEditingNote] = useState('');

  // Mock data - Backend'den gelecek
  const [tableNumber, setTableNumber] = useState('');
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Nakit');

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditingQuantity(item.quantity);
    setEditingNote(item.note || '');
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    setCartItems(cartItems.map(item => item.id === editingItem.id ? { ...item, quantity: editingQuantity, note: editingNote } : item));
    setEditModalVisible(false);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getServiceFee = () => {
    return 0.00; // Restoran içi sipariş için servis ücreti yok
  };

  const getTotal = () => {
    return getSubtotal() + getServiceFee();
  };

  const renderCartItem = ({ item }) => (
    <TouchableOpacity style={styles.cartItem} onPress={() => openEditModal(item)}>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">{item.name || item.title || item.productName || item.label || `Ürün #${item.id}`}</Text>
        {item.note ? <Text style={styles.itemNote}>Not: {item.note}</Text> : null}
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemTotal}>₺{(item.price * item.quantity).toFixed(2)}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeItem(item.id)}>
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleCheckout = () => {
    // Navigate to order confirmation
    navigation.navigate('OrderConfirmation', {
      cart: cartItems,
      restaurant,
      total: getTotal()
    });
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sepetim</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartIcon}>🛒</Text>
          <Text style={styles.emptyCartTitle}>Sepetiniz Boş</Text>
          <Text style={styles.emptyCartText}>Menüden ürün seçerek sipariş vermeye başlayın</Text>
          <TouchableOpacity 
            style={styles.browseMenuButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.browseMenuButtonText}>Menüye Göz At</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sepetim</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Restaurant Info */}
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantType}>{restaurant.type}</Text>
        </View>

        {/* Cart Items */}
        <View style={styles.cartSection}>
          <Text style={styles.sectionTitle}>Siparişiniz</Text>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            scrollEnabled={false}
          />
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Sipariş Özeti</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ara Toplam</Text>
            <Text style={styles.summaryValue}>₺{getSubtotal().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Servis Ücreti</Text>
            <Text style={styles.summaryValue}>₺{getServiceFee().toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Toplam</Text>
            <Text style={styles.totalValue}>₺{getTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* Table Number */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>Masa Numarası</Text>
          <View style={styles.tableInputContainer}>
            <Text style={styles.tableLabel}>Masa No:</Text>
            <TextInput
              style={styles.tableInput}
              placeholder="Örn: 15"
              keyboardType="numeric"
              value={tableNumber}
              onChangeText={setTableNumber}
            />
          </View>
          {cartItems.length > 0 && (
            <TouchableOpacity style={styles.clearCartButton} onPress={() => clearCart()}>
              <Text style={styles.clearCartText}>Sepeti Temizle</Text>
            </TouchableOpacity>
          )}
          {/* Payment Method Picker (non-functional placeholder) */}
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Ödeme Seçeneği</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>{selectedPaymentMethod}</Text>
              <TouchableOpacity style={styles.paymentButton} onPress={() => setPaymentModalVisible(true)}>
                <Text style={styles.paymentButtonText}>Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutContainer}>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>
            Siparişi Onayla - ₺{getTotal().toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}><Text style={styles.modalClose}>Kapat</Text></TouchableOpacity>
          </View>
          {editingItem && (
            <View style={styles.modalContent}>
              <Image source={editingItem.image} style={styles.modalImage} />
              <Text style={styles.modalTitle}>{editingItem.name}</Text>
              <Text style={styles.modalPrice}>₺{editingItem.price.toFixed(2)}</Text>
              <View style={styles.modalQuantityRow}>
                <TouchableOpacity style={styles.modalQtyButton} onPress={() => setEditingQuantity(q => Math.max(1, q - 1))}>
                  <Text style={styles.modalQtyText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.modalQtyValue}>{editingQuantity}</Text>
                <TouchableOpacity style={styles.modalQtyButton} onPress={() => setEditingQuantity(q => q + 1)}>
                  <Text style={styles.modalQtyText}>+</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.noteInput}
                placeholder="Sipariş notu (örn: Sos ayrı olsun)"
                value={editingNote}
                onChangeText={setEditingNote}
              />
              <TouchableOpacity style={styles.modalAddButton} onPress={() => { setEditingItem({ ...editingItem, quantity: editingQuantity, note: editingNote }); saveEdit(); }}>
                <Text style={styles.modalAddButtonText}>Güncelle</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* Payment Modal */}
      <Modal visible={paymentModalVisible} animationType="slide" onRequestClose={() => setPaymentModalVisible(false)} transparent={true}>
        <SafeAreaView style={styles.payModalWrap}>
          <View style={styles.payModal}>
            <Text style={styles.payTitle}>Ödeme Seçenekleri</Text>
            {['Nakit','Kart ile Ödeme','Online Ödeme'].map(method => (
              <TouchableOpacity key={method} style={[styles.payOption, selectedPaymentMethod === method && styles.payOptionActive]} onPress={() => { setSelectedPaymentMethod(method); setPaymentModalVisible(false); }}>
                <Text style={[styles.payOptionText, selectedPaymentMethod === method && styles.payOptionTextActive]}>{method}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.payClose} onPress={() => setPaymentModalVisible(false)}>
              <Text style={styles.payCloseText}>Kapat</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  content: {
    flex: 1,
  },
  restaurantInfo: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  restaurantType: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cartSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summarySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tableSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemNote: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 6,
  },
  removeButton: {
    marginLeft: 10,
    padding: 6,
  },
  removeButtonText: {
    fontSize: 18,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
    flexShrink: 1,
  },
  itemPrice: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    // use fixed width so the controls don't squeeze other items and cause wrapping
    width: 110,
    justifyContent: 'center',
  },
  quantityButton: {
    backgroundColor: '#FF6B35',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    width: 80,
    flexShrink: 0,
    textAlign: 'right',
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
    minWidth: 0, // allow text to truncate instead of pushing layout
  },
  itemPrice: {
    fontSize: 14,
    color: '#7F8C8D',
    flexWrap: 'nowrap',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  summaryValue: {
    fontSize: 16,
    color: '#2C3E50',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    marginTop: 10,
    paddingTop: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  tableInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // replace gap with spacing on children
  },

  paymentSection: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentLabel: { fontSize: 16, color: '#2C3E50' },
  paymentButton: { backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  paymentButtonText: { color: '#FFFFFF', fontWeight: '700' },
  payModalWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  payModal: { width: '90%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, alignItems: 'center' },
  payTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  payOption: { width: '100%', paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#EEE' },
  payOptionActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  payOptionText: { textAlign: 'center', color: '#2C3E50' },
  payOptionTextActive: { color: '#FFF', fontWeight: '700' },
  payClose: { marginTop: 8 },
  payCloseText: { color: '#2C3E50', fontWeight: '700' },
  tableLabel: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '500',
  },
  tableInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  clearCartButton: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },
  clearCartText: {
    color: '#E74C3C',
    fontWeight: '700',
  },
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalClose: { color: '#2C3E50', fontWeight: '700' },
  modalContent: { padding: 20, alignItems: 'center' },
  modalImage: { width: 200, height: 200, borderRadius: 12, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
  modalPrice: { fontSize: 18, fontWeight: '700', color: '#FF6B35', marginBottom: 12 },
  modalQuantityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalQtyButton: { backgroundColor: '#FF6B35', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  modalQtyText: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  modalQtyValue: { marginHorizontal: 20, fontSize: 18, fontWeight: '700' },
  noteInput: { width: '100%', borderWidth: 1, borderColor: '#E1E8ED', borderRadius: 8, padding: 12, marginBottom: 12 },
  checkoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyCartIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyCartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  browseMenuButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  browseMenuButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
