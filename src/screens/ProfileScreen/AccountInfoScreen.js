import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { userService } from '../../services';
import { useAuth } from '../../context/AuthContext';

export default function AccountInfoScreen({ navigation, route }) {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
  });
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setUserInfo({
        name: profile.name || user?.username || '',
        email: profile.email || user?.email || '',
        username: profile.username || user?.username || profile.name || '',
        phone: profile.phone || '',
      });
    } catch (error) {
      console.log('Error loading profile:', error);
      setUserInfo({
        name: user?.username || '',
        email: user?.email || '',
        username: user?.username || '',
        phone: '',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await userService.updateProfile({
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
      });
      Alert.alert('Başarılı', 'Profil bilgileri güncellendi');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView edges={['top']} style={{ backgroundColor: '#fff' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#2C3E50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hesap Bilgileri</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar Bölümü */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {userInfo.username ? userInfo.username.slice(0, 2).toUpperCase() : 
               userInfo.name ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase() : '--'}
            </Text>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <FontAwesome name="camera" size={14} color={COLORS.PRIMARY} />
            <Text style={styles.changePhotoText}>Fotoğraf Değiştir</Text>
          </TouchableOpacity>
        </View>

        {/* Kişisel Bilgiler Bölümü */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Ad Soyad</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="user" size={16} color="#95A5A6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={userInfo.name}
                onChangeText={text => handleInputChange('name', text)}
                placeholder="Ad Soyad"
                placeholderTextColor="#BDC3C7"
              />
            </View>
          </View>
          
          {/* E-posta Bölümü */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-posta Adresi</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="envelope" size={14} color="#95A5A6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={userInfo.email}
                onChangeText={text => handleInputChange('email', text)}
                placeholder="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#BDC3C7"
              />
            </View>
          </View>

          {/* Telefon Numarası Bölümü */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Telefon Numarası</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome name="phone" size={16} color="#95A5A6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={userInfo.phone}
                onChangeText={text => handleInputChange('phone', text)}
                placeholder="Telefon"
                keyboardType="phone-pad"
                placeholderTextColor="#BDC3C7"
              />
            </View>
          </View>
        </View>

        {/* Şifre Bölümü */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.passwordHeader}
            onPress={() => setPasswordExpanded(!passwordExpanded)}
          >
            <View style={styles.passwordHeaderLeft}>
              <FontAwesome name="lock" size={18} color={COLORS.PRIMARY} />
              <Text style={styles.passwordTitle}>Şifre Değiştir</Text>
            </View>
            <FontAwesome 
              name={passwordExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#95A5A6" 
            />
          </TouchableOpacity>
          
          {passwordExpanded && (
            <View style={styles.passwordContent}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Mevcut Şifre</Text>
                <View style={styles.inputWrapper}>
                  <FontAwesome name="lock" size={14} color="#95A5A6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mevcut şifrenizi girin"
                    secureTextEntry
                    placeholderTextColor="#BDC3C7"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre</Text>
                <View style={styles.inputWrapper}>
                  <FontAwesome name="lock" size={14} color="#95A5A6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Yeni şifrenizi girin"
                    secureTextEntry
                    placeholderTextColor="#BDC3C7"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Yeni Şifre (Tekrar)</Text>
                <View style={styles.inputWrapper}>
                  <FontAwesome name="lock" size={14} color="#95A5A6" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Yeni şifrenizi tekrar girin"
                    secureTextEntry
                    placeholderTextColor="#BDC3C7"
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Kaydet Butonu */}
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
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0FF',
  },
  changePhotoText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginLeft: 6,
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
  },
  passwordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  passwordHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 12,
  },
  passwordContent: {
    marginTop: 16,
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
