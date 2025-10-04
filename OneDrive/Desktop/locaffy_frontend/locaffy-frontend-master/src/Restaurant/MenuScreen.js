import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView,
  FlatList
} from 'react-native';
import { useState } from 'react';

export default function MenuScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const [activeCategory, setActiveCategory] = useState(0);
  const [cart, setCart] = useState([]);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  // Mock data - Backend'den gelecek
  const mockMenuData = {
    categories: [
      {
        id: 'main',
        name: 'Ana Yemekler',
        items: [
          {
            id: 1,
            name: 'Izgara Biftek',
            description: 'Özel baharatlarla marine edilmiş dana biftek, patates kızartması ve salata ile',
            price: 89.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: false,
            isSpicy: false
          },
          {
            id: 2,
            name: 'Tavuk Şinitzel',
            description: 'Çıtır tavuk göğsü, patates kızartması ve taze salata ile',
            price: 65.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: false,
            isSpicy: false
          },
          {
            id: 3,
            name: 'Balık Fileto',
            description: 'Taze levrek fileto, sebze garnitürü ve limon sosu ile',
            price: 75.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: false,
            isSpicy: false
          },
          {
            id: 4,
            name: 'Mantarlı Risotto',
            description: 'Kremalı mantar risotto, parmesan peyniri ile',
            price: 55.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: true,
            isSpicy: false
          }
        ]
      },
      {
        id: 'drinks',
        name: 'İçecekler',
        items: [
          {
            id: 5,
            name: 'Ayran',
            description: 'Ev yapımı ayran',
            price: 8.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: true,
            isSpicy: false
          },
          {
            id: 6,
            name: 'Türk Kahvesi',
            description: 'Geleneksel Türk kahvesi, lokum ile',
            price: 12.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: true,
            isSpicy: false
          },
          {
            id: 7,
            name: 'Fresh Limonata',
            description: 'Taze limon suyu, nane yaprakları ile',
            price: 15.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: true,
            isSpicy: false
          }
        ]
      },
      {
        id: 'desserts',
        name: 'Tatlılar',
        items: [
          {
            id: 8,
            name: 'Baklava',
            description: 'Antep fıstıklı baklava, dondurma ile',
            price: 25.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: true,
            isSpicy: false
          },
          {
            id: 9,
            name: 'Tiramisu',
            description: 'Geleneksel İtalyan tiramisu',
            price: 22.90,
            image: require('../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: true,
            isSpicy: false
          }
        ]
      }
    ]
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const addToCartFromModal = (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity }]);
    }
    setDetailModalVisible(false);
    setDetailQuantity(1);
  };

  const removeFromCart = (itemId) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getCartItemQuantity = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const renderMenuItem = ({ item }) => {
    const quantity = getCartItemQuantity(item.id);
    
    return (
      <TouchableOpacity style={styles.menuItem} onPress={() => { setSelectedItem(item); setDetailQuantity(1); setDetailModalVisible(true); }}>
        <Image source={item.image} style={styles.menuItemImage} />
        <View style={styles.menuItemContent}>
          <View style={styles.menuItemHeader}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <View style={styles.badgesContainer}>
              {item.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.badgeText}>Popüler</Text>
                </View>
              )}
              {item.isVegetarian && (
                <View style={styles.vegetarianBadge}>
                  <Text style={styles.badgeText}>Vejetaryen</Text>
                </View>
              )}
              {item.isSpicy && (
                <View style={styles.spicyBadge}>
                  <Text style={styles.badgeText}>Acılı</Text>
                </View>
              )}
            </View>
          </View>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <View style={styles.menuItemFooter}>
            <Text style={styles.menuItemPrice}>₺{item.price.toFixed(2)}</Text>
            <View style={styles.quantityControls}>
              {quantity > 0 && (
                <>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                </>
              )}
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Item detail modal
  const renderDetailModal = () => (
    <Modal
      visible={detailModalVisible}
      animationType="slide"
      onRequestClose={() => setDetailModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
            <Text style={styles.modalClose}>Kapat</Text>
          </TouchableOpacity>
        </View>
        {selectedItem && (
          <View style={styles.modalContent}>
            <Image source={selectedItem.image} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedItem.name}</Text>
            <Text style={styles.modalDescription}>{selectedItem.description}</Text>
            <Text style={styles.modalPrice}>₺{selectedItem.price.toFixed(2)}</Text>
            <View style={styles.modalQuantityRow}>
              <TouchableOpacity style={styles.modalQtyButton} onPress={() => setDetailQuantity(q => Math.max(1, q - 1))}>
                <Text style={styles.modalQtyText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.modalQtyValue}>{detailQuantity}</Text>
              <TouchableOpacity style={styles.modalQtyButton} onPress={() => setDetailQuantity(q => q + 1)}>
                <Text style={styles.modalQtyText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.modalAddButton} onPress={() => addToCartFromModal(selectedItem, detailQuantity)}>
              <Text style={styles.modalAddButtonText}>Sepete Ekle</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderCategory = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.categoryTab, activeCategory === index && styles.activeCategoryTab]}
      onPress={() => setActiveCategory(index)}
    >
      <Text style={[styles.categoryText, activeCategory === index && styles.activeCategoryText]}>
        {item.name}
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
        <Text style={styles.headerTitle}>{restaurant.name}</Text>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart', { cart, restaurant })}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Self Service Check */}
      {restaurant.isSelfService && (
        <View style={styles.selfServiceBanner}>
          <Text style={styles.selfServiceText}>🔄 Self Servis</Text>
        </View>
      )}

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={mockMenuData.categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>

      {/* Menu Items */}
      <FlatList
        data={mockMenuData.categories[activeCategory].items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMenuItem}
        style={styles.menuList}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartItems}>{getTotalItems()} ürün</Text>
            <Text style={styles.cartTotal}>₺{getTotalPrice().toFixed(2)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Cart', { cart, restaurant })}
          >
            <Text style={styles.checkoutButtonText}>Sepete Git</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    flex: 1,
    textAlign: 'center',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartIcon: {
    fontSize: 24,
    color: '#2C3E50',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 10,
  },
  categoriesContent: {
    paddingHorizontal: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  activeCategoryTab: {
    backgroundColor: '#FF6B35',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7F8C8D',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  menuList: {
    flex: 1,
  },
  menuContent: {
    padding: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  popularBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegetarianBadge: {
    backgroundColor: '#27AE60',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  spicyBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
    marginBottom: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    backgroundColor: '#FF6B35',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  modalHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  modalClose: {
    color: '#2C3E50',
    fontWeight: '700'
  },
  modalContent: {
    padding: 20,
    alignItems: 'center'
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8
  },
  modalDescription: {
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 12
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
    marginBottom: 12
  },
  modalQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  modalQtyButton: {
    backgroundColor: '#FF6B35',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalQtyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700'
  },
  modalQtyValue: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '700'
  },
  modalAddButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center'
  },
  modalAddButtonText: {
    color: '#FFFFFF',
    fontWeight: '700'
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cartInfo: {
    flex: 1,
  },
  cartItems: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  checkoutButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selfServiceBanner: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4E6D4',
  },
  selfServiceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
});
