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
import { styles } from './styles';
import {FontAwesome} from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
  const userInfo = {
    name: 'Emre Çalışkan',
    email: 'emre@example.com',
    phone: '+90 555 123 45 67',
    avatar: null,
    memberSince: 'Ocak 2024',
    totalOrders: 23,
    favoriteRestaurants: 5
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
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
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
      icon: '📅',
      onPress: () => navigation.navigate('Reservations'),
    },
    {
      id: 2,
      title: 'Favori Restoranlar',
      subtitle: 'Beğendiğiniz restoranlar',
      icon: '❤️',
      onPress: () => {
        Alert.alert('Bilgi', 'Favori restoranlar özelliği yakında eklenecek!');
      },
    },
    {
      id: 3,
      title: 'Bildirimler',
      subtitle: 'Bildirim ayarlarını yönetin',
      icon: '🔔',
      onPress: () => {
        Alert.alert('Bilgi', 'Bildirim ayarları yakında eklenecek!');
      },
    },
    {
      id: 4,
      title: 'Yardım ve Destek',
      subtitle: 'SSS ve iletişim',
      icon: '❓',
      onPress: () => {
        Alert.alert('Bilgi', 'Yardım merkezi yakında eklenecek!');
      },
    },
    {
      id: 5,
      title: 'Hakkında',
      subtitle: 'Uygulama bilgileri',
      icon: 'ℹ️',
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
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
            <TouchableOpacity style={styles.editButton}>
              <FontAwesome name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
            <Text style={styles.userPhone}>{userInfo.phone}</Text>
            <Text style={styles.memberSince}>Üye: {userInfo.memberSince}</Text>
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
                <Text style={styles.menuIcon}>{item.icon}</Text>
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