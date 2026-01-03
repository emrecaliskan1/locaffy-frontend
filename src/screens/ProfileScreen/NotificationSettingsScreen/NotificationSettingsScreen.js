import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles';

export default function NotificationSettingsScreen({ navigation }) {
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState({
    reservations: true,
    updates: true,
    email: true,
    push: true,
  });
  const [saving, setSaving] = useState(false);

  const handleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Bildirim Ayarları</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bildirim Türleri */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bildirim Türleri</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <FontAwesome name="calendar" size={18} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Rezervasyonlar</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Rezervasyon hatırlatmaları ve güncellemeler</Text>
              </View>
            </View>
            <Switch
              value={notifications.reservations}
              onValueChange={() => handleToggle('reservations')}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome name="info-circle" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Uygulama Güncellemeleri</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Yeni özellikler ve iyileştirmeler</Text>
              </View>
            </View>
            <Switch
              value={notifications.updates}
              onValueChange={() => handleToggle('updates')}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Bildirim Kanalları */}
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Bildirim Kanalları</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <FontAwesome name="envelope" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>E-posta Bildirimleri</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>E-posta ile bildirim al</Text>
              </View>
            </View>
            <Switch
              value={notifications.email}
              onValueChange={() => handleToggle('email')}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome name="bell" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Anlık Bildirimler</Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>Uygulama üzerinden bildirim al</Text>
              </View>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={() => handleToggle('push')}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.saveButtonText, { color: '#FFFFFF' }]}>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}
