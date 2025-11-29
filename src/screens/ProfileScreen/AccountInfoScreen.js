import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, StatusBar, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { userService, imageService } from '../../services';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Toast from '../../components/Toast';

export default function AccountInfoScreen({ navigation, route }) {
  const { user, updateProfileImage } = useAuth();
  const { theme } = useTheme();
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    username: '',
    phone: '',
  });
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const loadUserProfile = async () => {
    try {
      setLoading(true);
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
      showToast('Değişiklikler kaydedildi', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      showToast('Profil güncellenirken bir hata oluştu', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Profil fotoğrafı yükleme
  const handleUploadProfileImage = async () => {
    if (uploadingImage) return;
    
    try {
      setUploadingImage(true);
      
      const result = await imageService.selectAndUploadProfileImage();
      
      if (result.success) {
        showToast('Profil fotoğrafı başarıyla yüklendi', 'success');
        if (result.data && result.data.imageUrl) {
          setProfileImageUrl(result.data.imageUrl);
          updateProfileImage(result.data.imageUrl);
        }
      } else {
        showToast(result.message || 'Fotoğraf yüklenemedi', 'error');
      }
    } catch (error) {
      console.error('Profil fotoğrafı yükleme hatası:', error);
      showToast(`Fotoğraf yüklenirken hata oluştu: ${error.message}`, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Hesap Bilgileri</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar Bölümü */}
        <View style={[styles.avatarSection, { backgroundColor: theme.colors.card }]}>
          {profileImageUrl || user?.profileImageUrl ? (
            <Image 
              source={{ uri: profileImageUrl || user?.profileImageUrl }} 
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {userInfo.username ? userInfo.username.slice(0, 2).toUpperCase() : 
                 userInfo.name ? userInfo.name.split(' ').map(n => n[0]).join('').toUpperCase() : '--'}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.changePhotoButton, { backgroundColor: theme.colors.background }]}
            onPress={handleUploadProfileImage}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>Yükleniyor...</Text>
              </>
            ) : (
              <>
                <FontAwesome name="camera" size={14} color={theme.colors.primary} />
                <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>Fotoğraf Değiştir</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Kişisel Bilgiler Bölümü */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Kişisel Bilgiler</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Ad Soyad</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <FontAwesome name="user" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={userInfo.name}
                onChangeText={text => handleInputChange('name', text)}
                placeholder="Ad Soyad"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>
          
          {/* E-posta Bölümü */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>E-posta Adresi</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <FontAwesome name="envelope" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={userInfo.email}
                onChangeText={text => handleInputChange('email', text)}
                placeholder="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>

          {/* Telefon Numarası Bölümü */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Telefon Numarası</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
              <FontAwesome name="phone" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={userInfo.phone}
                onChangeText={text => handleInputChange('phone', text)}
                placeholder="Telefon"
                keyboardType="phone-pad"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* Şifre Bölümü */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity 
            style={styles.passwordHeader}
            onPress={() => setPasswordExpanded(!passwordExpanded)}
          >
            <View style={styles.passwordHeaderLeft}>
              <FontAwesome name="lock" size={18} color={theme.colors.primary} />
              <Text style={[styles.passwordTitle, { color: theme.colors.text }]}>Şifre Değiştir</Text>
            </View>
            <FontAwesome 
              name={passwordExpanded ? "chevron-up" : "chevron-down"} 
              size={16} 
              color={theme.colors.textTertiary} 
            />
          </TouchableOpacity>
          
          {passwordExpanded && (
            <View style={styles.passwordContent}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Mevcut Şifre</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                  <FontAwesome name="lock" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Mevcut şifrenizi girin"
                    secureTextEntry
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Yeni Şifre</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                  <FontAwesome name="lock" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Yeni şifrenizi girin"
                    secureTextEntry
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Yeni Şifre (Tekrar)</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                  <FontAwesome name="lock" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Yeni şifrenizi tekrar girin"
                    secureTextEntry
                    placeholderTextColor={theme.colors.textTertiary}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Kaydet Butonu */}
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
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={3000}
        onHide={hideToast}
      />
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
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
