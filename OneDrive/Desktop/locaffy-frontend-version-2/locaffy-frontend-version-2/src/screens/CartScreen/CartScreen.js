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
import { styles } from './styles';

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

