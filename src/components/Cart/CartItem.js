import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

export const CartItem = ({ 
  item, 
  onEdit, 
  onUpdateQuantity, 
  onRemove, 
  styles 
}) => (
  <TouchableOpacity style={styles.cartItem} onPress={() => onEdit(item)}>
    <Image source={item.image} style={styles.cartItemImage} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1} ellipsizeMode="tail">
        {item.name || item.title || item.productName || item.label || `Ürün #${item.id}`}
      </Text>
      {item.note ? <Text style={styles.itemNote}>Not: {item.note}</Text> : null}
    </View>
    <View style={styles.quantityControls}>
      <TouchableOpacity 
        style={styles.quantityButton}
        onPress={() => onUpdateQuantity(item.id, item.quantity - 1)}
      >
        <Text style={styles.quantityButtonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.quantityText}>{item.quantity}</Text>
      <TouchableOpacity 
        style={styles.quantityButton}
        onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
      >
        <Text style={styles.quantityButtonText}>+</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.itemTotal}>₺{(item.price * item.quantity).toFixed(2)}</Text>
    <TouchableOpacity style={styles.removeButton} onPress={() => onRemove(item.id)}>
      <Text style={styles.removeButtonText}>🗑️</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);