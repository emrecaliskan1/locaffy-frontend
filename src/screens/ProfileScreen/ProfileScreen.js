import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import {FontAwesome} from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  
  const userInfo = {
    username: user?.username || '',
    email: user?.email || '',
    avatar: null,
    totalOrders: 23,
    favoriteRestaurants: 5
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        showToast('Çıkış yapıldı', 'success');
      } else {
        showToast(result.message || 'Çıkış yapılamadı', 'error');
      }
    } catch (error) {
      showToast('Çıkış yapılırken hata oluştu', 'error');
    }
  };

  const menuItems = [
    {
      id: 1,
      title: 'Rezervasyonlarım',
      subtitle: 'Aktif ve geçmiş rezervasyonlar',
      icon: 'calendar',
      iconColor: '#667eea',
      onPress: () => navigation.navigate('Reservations'),
    },
    {
      id: 2,
      title: 'Favori Restoranlar',
      subtitle: 'Beğendiğiniz restoranlar',
      icon: 'heart',
      iconColor: '#E74C3C', 
      onPress: () => {
        // Favori restoranlar özelliği yakında eklenecek
      },
    },
    {
      id: 3,
      title: 'Bildirimler',
      subtitle: 'Bildirim ayarlarını yönetin',
      icon: 'bell',
      iconColor: '#F39C12', 
      onPress: () => {
        // Bildirim ayarları yakında eklenecek
      },
    },
    {
      id: 4,
      title: 'Yardım ve Destek',
      subtitle: 'SSS ve iletişim',
      icon: 'question-circle',
      iconColor: '#667eea',
      onPress: () => {
        // Yardım merkezi yakında eklenecek
      },
    },
    {
      id: 5,
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      icon: 'info-circle',
      iconColor: '#667eea',
      onPress: () => {
        // Uygulama bilgileri
      },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>


        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            {userInfo.avatar ? (
              <Image source={userInfo.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {userInfo.username ? userInfo.username.slice(0, 2).toUpperCase() : '--'}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.username}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.totalOrders}</Text>
            <Text style={styles.statLabel}>Toplam Sipariş</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userInfo.favoriteRestaurants}</Text>
            <Text style={styles.statLabel}>Favori Restoran</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <FontAwesome name={item.icon} size={18} color={item.iconColor || "#667eea"} style={styles.menuIcon} />
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={1000}
        onHide={hideToast}
      />
    </View>
  );
}