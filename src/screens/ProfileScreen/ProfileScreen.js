import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './styles';
import {FontAwesome} from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLocation } from '../../context/LocationContext';
import Toast from '../../components/Toast';
import { userService, reservationService, imageService } from '../../services';
import { useToast, useFavorites, useReservations } from '../../hooks';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { isDarkMode, theme, toggleTheme } = useTheme();
  const { setOnCitySelectedCallback } = useLocation();
  
  const { toast, showToast, hideToast } = useToast();
  const { favorites, loadFavorites } = useFavorites();
  const { activeReservations, pastReservations, loadReservations } = useReservations();
  
  const [isLoading, setIsLoading] = useState(true);
  
  const userStats = {
    totalReservations: activeReservations.length + pastReservations.length,
    favoriteRestaurants: favorites.length
  };
  
  const userInfo = {
    username: user?.username || '',
    email: user?.email || '',
    userId: user?.userId || null,
    avatar: user?.profileImageUrl || null,
    ...userStats
  };

  //Avatar altındaki istatistikler
  const loadUserStats = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadReservations(), loadFavorites()]);
    } catch (error) {
      console.log('Genel yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadUserStats();
    }, [])
  );

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
      title: 'Favori Mekanlar',
      subtitle: 'Beğendiğiniz restoranlar',
      icon: 'heart',
      iconColor: '#E74C3C', 
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      id: 3,
      title: 'Karanlık Mod',
      subtitle: 'Görünüm temasını değiştirin',
      icon: isDarkMode ? 'moon-o' : 'sun-o',
      iconColor: '#F39C12',
      onPress: toggleTheme,
      isToggle: true,
      toggleValue: isDarkMode,
    },
    {
      id: 4,
      title: 'Bildirimler',
      subtitle: 'Bildirim ayarlarını yönetin',
      icon: 'bell',
      iconColor: '#F39C12', 
      onPress: () => navigation.navigate('NotificationSettings'),
    },
    {
      id: 5,
      title: 'Şehir Seç',
      subtitle: 'Konumunuzu değiştirin',
      icon: 'map-marker',
      iconColor: '#667eea',
      onPress: () => {
        // Şehir seçimi sonrası Map tab'ına git
        setOnCitySelectedCallback(() => {
          navigation.navigate('Map');
        });
        navigation.navigate('CitySelectionModal', { isModal: true });
      },
    },
    {
      id: 6,
      title: 'Yardım ve Destek',
      subtitle: 'SSS ve iletişim',
      icon: 'question-circle',
      iconColor: '#667eea',
      onPress: () => navigation.navigate('HelpSupport'),
    },
    {
      id: 7,
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      icon: 'info-circle',
      iconColor: '#667eea',
      onPress: () => navigation.navigate('AboutScreen'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profil</Text>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Kullanıcı Kartı */}
        <View
          style={[
            styles.userCard,
            isDarkMode && {
              backgroundColor: theme.colors.background,
              elevation: 0,
              shadowColor: 'transparent',
              borderWidth: 0,
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            {userInfo.avatar ? (
              <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
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
            <Text style={[styles.userName, { color: theme.colors.text }]}>{userInfo.username}</Text>
            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>{userInfo.email}</Text>
          </View>
        </View>

        {/* Kullanıcı İstatistikleri */}
        <View
          style={[
            styles.statsContainer,
            isDarkMode && {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              elevation: 0,
              shadowColor: 'transparent',
              borderWidth: 0,
            },
          ]}
        >
          <View style={styles.statItem}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>{userInfo.totalReservations}</Text>
            )}
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Toplam Rezervasyon</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#667eea" />
            ) : (
              <Text style={[styles.statNumber, { color: theme.colors.text }]}>{userInfo.favoriteRestaurants}</Text>
            )}
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Favori Restoran</Text>
          </View>
        </View>

        {/* Menü Seçenekleri */}
        <View style={[
          styles.menuContainer,
          isDarkMode && { backgroundColor: theme.colors.background }
        ]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                { borderBottomColor: theme.colors.borderLight },
                index === menuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <FontAwesome name={item.icon} size={18} color={item.iconColor || "#667eea"} style={styles.menuIcon} />
                <View style={styles.menuTextContainer}>
                  <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
                  <Text style={[styles.menuSubtitle, { color: theme.colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
              </View>
              {item.isToggle ? (
                <Switch
                  value={item.toggleValue}
                  onValueChange={toggleTheme}
                  trackColor={{ false: '#767577', true: '#667eea' }}
                  thumbColor={item.toggleValue ? '#ffffff' : '#f4f3f4'}
                />
              ) : (
                <Text style={[styles.chevron, { color: theme.colors.textTertiary }]}>›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.error }]} onPress={handleLogout}>
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