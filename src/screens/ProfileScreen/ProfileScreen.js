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
      onPress: () => navigation.navigate('Reservations'),
    },
    {
      id: 2,
      title: 'Favori Restoranlar',
      subtitle: 'Beğendiğiniz restoranlar',
      icon: 'heart',
      iconColor: '#E74C3C', // Light red
      onPress: () => navigation.navigate('FavoriteRestaurants'),
    },
    {
      id: 3,
      title: 'Bildirimler',
      subtitle: 'Bildirim ayarlarını yönetin',
      icon: 'bell',
      iconColor: '#F39C12', // Light yellow/orange
      onPress: () => navigation.navigate('NotificationSettings'),
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
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo.name}</Text>
            <Text style={styles.userEmail}>{userInfo.email}</Text>
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