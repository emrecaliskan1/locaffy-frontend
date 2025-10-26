import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';

export default function NotificationSettingsScreen({ navigation }) {
  const [notifications, setNotifications] = useState({
    reservations: true,
    promotions: false,
    updates: true,
    email: true,
    sms: false,
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bildirim Ayarları</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Bildirim Türleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Türleri</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome name="calendar" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Rezervasyonlar</Text>
                <Text style={styles.settingDescription}>Rezervasyon hatırlatmaları ve güncellemeler</Text>
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
              <FontAwesome name="gift" size={18} color="#F39C12" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Kampanyalar ve Fırsatlar</Text>
                <Text style={styles.settingDescription}>Özel teklifler ve indirimler</Text>
              </View>
            </View>
            <Switch
              value={notifications.promotions}
              onValueChange={() => handleToggle('promotions')}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome name="info-circle" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Uygulama Güncellemeleri</Text>
                <Text style={styles.settingDescription}>Yeni özellikler ve iyileştirmeler</Text>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Kanalları</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome name="envelope" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>E-posta Bildirimleri</Text>
                <Text style={styles.settingDescription}>E-posta ile bildirim al</Text>
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
              <FontAwesome name="comment" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>SMS Bildirimleri</Text>
                <Text style={styles.settingDescription}>SMS ile bildirim al</Text>
              </View>
            </View>
            <Switch
              value={notifications.sms}
              onValueChange={() => handleToggle('sms')}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <FontAwesome name="bell" size={18} color="#667eea" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Anlık Bildirimler</Text>
                <Text style={styles.settingDescription}>Uygulama üzerinden bildirim al</Text>
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
          style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  saveButton: {
    backgroundColor: COLORS.PRIMARY,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
