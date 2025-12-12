import { FontAwesome, FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Restoran type'ına göre icon bilgilerini döndüren fonksiyon
export const getRestaurantIcon = (type) => {
  const iconMap = {
    'CAFE': { name: 'coffee', iconType: 'FontAwesome', color: '#ffffffff' },
    'RESTAURANT': { name: 'cutlery', iconType: 'FontAwesome', color: '#ffffffff' },
    'BAR': { name: 'glass', iconType: 'FontAwesome', color: '#ffffffff' },
    'BISTRO': { name: 'cutlery', iconType: 'FontAwesome', color: '#ffffffff' },
    'DESSERT': { name: 'birthday-cake', iconType: 'FontAwesome', color: '#ffffffff' },
    'FASTFOOD': { name: 'hamburger', iconType: 'FontAwesome5', color: '#ffffffff' }
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
    case 'FontAwesome5':
      return <FontAwesome5 name={iconData.name} size={size} color={color} />;
    case 'FontAwesome':
    default:
      return <FontAwesome name={iconData.name} size={size} color={color} />;
  }
};

// HTML marker'lar için FontAwesome CSS class döndüren fonksiyon
export const getRestaurantIconForHTML = (type) => {
  if (type === 'RESTAURANT' || type === 'BISTRO') {
    return 'fas fa-utensils';
  } else if (type === 'CAFE') {
    return 'fas fa-coffee';
  } else if (type === 'BAR') {
    return 'fas fa-wine-glass';
  } else if (type === 'DESSERT') {
    return 'fas fa-birthday-cake';
  } else if (type === 'FASTFOOD') {
    return 'fas fa-hamburger';
  }
  
  // Legacy support
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