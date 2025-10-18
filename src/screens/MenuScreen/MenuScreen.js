import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';

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
            image: require('../../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: false,
            isSpicy: false
          },
          {
            id: 2,
            name: 'Tavuk Şinitzel',
            description: 'Çıtır tavuk göğsü, patates kızartması ve taze salata ile',
            price: 65.90,
            image: require('../../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: false,
            isSpicy: false
          },
          {
            id: 3,
            name: 'Balık Fileto',
            description: 'Taze levrek fileto, sebze garnitürü ve limon sosu ile',
            price: 75.90,
            image: require('../../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: false,
            isSpicy: false
          },
          {
            id: 4,
            name: 'Mantarlı Risotto',
            description: 'Kremalı mantar risotto, parmesan peyniri ile',
            price: 55.90,
            image: require('../../../assets/korean.jpeg'),
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
            image: require('../../../assets/korean.jpeg'),
            isPopular: false,
            isVegetarian: true,
            isSpicy: false
          },
          {
            id: 6,
            name: 'Türk Kahvesi',
            description: 'Geleneksel Türk kahvesi, lokum ile',
            price: 12.90,
            image: require('../../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: true,
            isSpicy: false
          },
          {
            id: 7,
            name: 'Fresh Limonata',
            description: 'Taze limon suyu, nane yaprakları ile',
            price: 15.90,
            image: require('../../../assets/korean.jpeg'),
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
            image: require('../../../assets/korean.jpeg'),
            isPopular: true,
            isVegetarian: true,
            isSpicy: false
          },
          {
            id: 9,
            name: 'Tiramisu',
            description: 'Geleneksel İtalyan tiramisu',
            price: 22.90,
            image: require('../../../assets/korean.jpeg'),
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={18} color="#2C3E50" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{restaurant.name}</Text>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart', { cart, restaurant })}
        >
          <FontAwesome name="shopping-cart" size={18} color="#667eea" style={styles.cartIcon} />
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      </SafeAreaView>

      {restaurant.isSelfService && (
        <View style={styles.selfServiceBanner}>
          <Text style={styles.selfServiceText}>🔄 Self Servis</Text>
        </View>
      )}

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

      <FlatList
        data={mockMenuData.categories[activeCategory].items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMenuItem}
        style={styles.menuList}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      />

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
    </View>
  );
}
