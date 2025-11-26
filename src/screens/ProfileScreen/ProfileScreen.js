import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './styles';
import {FontAwesome} from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Toast from '../../components/Toast';
import { userService, reservationService } from '../../services';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [userStats, setUserStats] = useState({ totalReservations: 0, favoriteRestaurants: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const userInfo = {
    username: user?.username || '',
    email: user?.email || '',
    avatar: null,
    ...userStats
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      // Rezervasyon sayısını al
      const reservations = await reservationService.getUserReservations();
      if (reservations) {
        setUserStats(prev => ({
          ...prev,
          totalReservations: reservations.length || 0
        }));
      }
    } catch (error) {
      setUserStats(prev => ({
        ...prev,
        totalReservations: 0
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserStats();
  }, []);

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
      id: 0,
      title: 'Hesap Bilgileri',
      subtitle: 'Kişisel bilgilerinizi görüntüleyin ve düzenleyin',
      icon: 'user-circle',
      iconColor: '#667eea',
      onPress: () => navigation.navigate('AccountInfo'),
    },
    {
      id: 1,
      title: 'Rezervasyonlarım',
      subtitle: 'Aktif ve geçmiş rezervasyonlar',
      icon: 'calendar',
      iconColor: '#667eea',
      onPress: () => navigation.navigate('Reservations', { fromProfile: true }),
    },
    {
      id: 2,
      title: 'Favori Restoranlar',
      subtitle: 'Beğendiğiniz restoranlar',
      icon: 'heart',
      iconColor: '#E74C3C', 
      onPress: () => navigation.navigate('FavoriteRestaurants'),
    },
    {
      id: 3,
      title: 'Bildirimler',
      subtitle: 'Bildirim ayarlarını yönetin',
      icon: 'bell',
      iconColor: '#F39C12', 
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      id: 4,
      title: 'Yardım ve Destek',
      subtitle: 'SSS ve iletişim',
      icon: 'question-circle',
      iconColor: '#667eea',
      onPress: () => {
      },
    },
    {
      id: 5,
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      icon: 'info-circle',
      iconColor: '#667eea',
      onPress: () => {
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

        {/* Kullanıcı Kartı */}
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
          </View>
          
          {/* Kullanıcı Bilgileri */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.username}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
          </View>
        </View>

        {/* Kullanıcı İstatistikleri */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Text style={styles.statNumber}>{userInfo.totalReservations}</Text>
            )}
            <Text style={styles.statLabel}>Toplam Rezervasyon</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Text style={styles.statNumber}>{userInfo.favoriteRestaurants}</Text>
            )}
            <Text style={styles.statLabel}>Favori Restoran</Text>
          </View>
        </View>

        {/* Menü Seçenekleri */}
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