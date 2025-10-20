import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { styles } from './styles';
import {FontAwesome} from '@expo/vector-icons';
import { authService } from '../../services/authService';

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = React.useState({
    username: '',
    email: '',
    avatar: null,
    totalOrders: 23,
    favoriteRestaurants: 5
  });

  // Kullanıcı bilgilerini yükle
  React.useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userData = await authService.getUserInfo();
      if (userData) {
        setUserInfo(prevInfo => ({
          ...prevInfo,
          username: userData.username || 'Kullanıcı',
          email: userData.email || 'kullanici@example.com',
        }));
      }
    } catch (error) {
      // Hata durumunda varsayılan değerleri kullan
      setUserInfo(prevInfo => ({
        ...prevInfo,
        username: '',
        email: '',
      }));
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.clearToken();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Auth' }],
                })
              );
            } catch (error) {
              Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
            }
          },
        },
      ]
    );
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
        Alert.alert('Bilgi', 'Favori restoranlar özelliği yakında eklenecek!');
      },
    },
    {
      id: 3,
      title: 'Bildirimler',
      subtitle: 'Bildirim ayarlarını yönetin',
      icon: 'bell',
      iconColor: '#F39C12', 
      onPress: () => {
        Alert.alert('Bilgi', 'Bildirim ayarları yakında eklenecek!');
      },
    },
    {
      id: 4,
      title: 'Yardım ve Destek',
      subtitle: 'SSS ve iletişim',
      icon: 'question-circle',
      iconColor: '#667eea',
      onPress: () => {
        Alert.alert('Bilgi', 'Yardım merkezi yakında eklenecek!');
      },
    },
    {
      id: 5,
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      icon: 'info-circle',
      iconColor: '#667eea',
      onPress: () => {
        Alert.alert('Locaffy', 'Versiyon 1.0.0\n\nYerel restoranları keşfedin ve sipariş verin.');
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
    </View>
  );
}