import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Restoran type'ına göre icon bilgilerini döndüren fonksiyon
export const getRestaurantIcon = (type) => {
  const iconMap = {
    'fast-food': { name: 'fastfood', iconType: 'MaterialIcons', color: '#ffffffff' },
    'asian-food': { name: 'cutlery', iconType: 'FontAwesome', color: '#ffffffff' },
    'kebab': { name: 'food-steak', iconType: 'MaterialCommunityIcons', color: '#ffffffff' },
    'dessert': { name: 'cupcake', iconType: 'MaterialCommunityIcons', color: '#ffffffff' },
    'pub': { name: 'glass', iconType: 'FontAwesome', color: '#ffffffff' },
    'cafe': { name: 'coffee', iconType: 'FontAwesome', color: '#ffffffff' },
    'default': { name: 'cutlery', iconType: 'FontAwesome', color: '#ffffffff' }
  };
  return iconMap[type] || iconMap.default;
};

export const getRestaurantIconComponent = (type, size = 24, customColor = null) => {
  const iconData = getRestaurantIcon(type);
  const color = customColor || iconData.color;
  
  switch (iconData.iconType) {
    case 'MaterialIcons':
      return <MaterialIcons name={iconData.name} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconData.name} size={size} color={color} />;
    case 'FontAwesome':
    default:
      return <FontAwesome name={iconData.name} size={size} color={color} />;
  }
};

// HTML marker'lar için FontAwesome CSS class döndüren fonksiyon (3 kategori gruplandırma)
export const getRestaurantIconForHTML = (type) => {

  const foodCategories = ['kebab', 'asian-food', 'fast-food'];
  
  if (foodCategories.includes(type)) {
    return 'fas fa-utensils';  
  } else if (type === 'cafe') {
    return 'fas fa-coffee';    
  } else if (type === 'dessert') {
    return 'fas fa-birthday-cake';  
  } else if (type === 'pub') {
    return 'fas fa-wine-glass';     
  }
  
  return 'fas fa-utensils'; 
};