import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import COLORS from '../../../constants/colors';
import { userService, imageService } from '../../../services';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import Toast from '../../../components/Toast';
import { styles } from './styles';
import { useToast, useForm } from '../../../hooks';

export default function AccountInfoScreen({ navigation, route }) {
  const { user, updateProfileImage } = useAuth();
  const { theme } = useTheme();
  const { toast, showToast, hideToast } = useToast();
  const { values: userInfo, handleChange: handleInputChange, setFieldValue } = useForm({
    username: '',
    email: '',
    phone: '',
  });
  
  const [passwordExpanded, setPasswordExpanded] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getProfile();
      setFieldValue('username', profile?.username || user?.username || '');
      setFieldValue('email', profile?.email || user?.email || '');
      setFieldValue('phone', profile?.phoneNumber || '');
      if (profile?.profileImageUrl) {
        setProfileImageUrl(profile.profileImageUrl);
      }
    } catch (error) {
      console.log('Profile load error:', error);
      setFieldValue('username', user?.username || '');
      setFieldValue('email', user?.email || '');
      setFieldValue('phone', '');
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
      
      // Validation
      if (!userInfo.username || userInfo.username.trim() === '') {
        showToast('Kullanıcı adı boş bırakılamaz', 'error');
        setSaving(false);
        return;
      }
      
      // Şifre değiştirme kontrolü
      if (passwordExpanded && (passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword)) {
        // Şifre alanlarından en az biri dolduysa hepsinin dolu olması gerekir
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
          showToast('Şifre değiştirmek için tüm şifre alanlarını doldurun', 'error');
          setSaving(false);
          return;
        }

        if (passwordData.newPassword.length < 6) {
          showToast('Yeni şifre en az 6 karakter olmalıdır', 'error');
          setSaving(false);
          return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
          showToast('Yeni şifre ve onay şifresi eşleşmiyor', 'error');
          setSaving(false);
          return;
        }

        // Şifre değiştir
        try {
          await userService.changePassword(passwordData);
          // Başarılı olursa şifre alanlarını temizle
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setPasswordExpanded(false);
        } catch (error) {
          showToast(error.message || 'Şifre değiştirilirken bir hata oluştu', 'error');
          setSaving(false);
          return;
        }
      }
      
      // Profil bilgilerini güncelle
      const updateData = {
        username: userInfo.username.trim(),
        phoneNumber: userInfo.phone ? userInfo.phone.trim() : '',
      };
      
      const updatedProfile = await userService.updateProfile(updateData);
      
      // Güncellenen profil bilgilerini state'e yaz
      setFieldValue('username', updatedProfile.username);
      setFieldValue('phone', updatedProfile.phoneNumber || '');
      
      showToast('Değişiklikler kaydedildi', 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      showToast(error.message || 'Profil güncellenirken bir hata oluştu', 'error');
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
        <View style={[styles.header, { backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Hesap Bilgileri</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Avatar Bölümü */}
        <View style={[styles.avatarSection, { backgroundColor: theme.colors.background }]}>
          {profileImageUrl || user?.profileImageUrl ? (
            <Image 
              source={{ uri: profileImageUrl || user?.profileImageUrl }} 
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.avatarText}>
                {userInfo.username ? userInfo.username.slice(0, 2).toUpperCase() : '--'}
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
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Kişisel Bilgiler</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Kullanıcı Adı</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
              <FontAwesome name="user" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={userInfo.username}
                onChangeText={text => handleInputChange('username', text)}
                placeholder="Kullanıcı Adı"
                placeholderTextColor={theme.colors.textTertiary}
              />
            </View>
          </View>
          
          {/* E-posta Bölümü - Readonly */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>E-posta Adresi</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, opacity: 0.7 }]}>
              <FontAwesome name="envelope" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.colors.textSecondary }]}
                value={userInfo.email}
                placeholder="E-posta"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={theme.colors.textTertiary}
                editable={false}
              />
            </View>
            <Text style={{ color: theme.colors.textTertiary, fontSize: 11, marginTop: 4, marginLeft: 4 }}>
              E-posta adresi değiştirilemez
            </Text>
          </View>

          {/* Telefon Numarası Bölümü */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Telefon Numarası</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
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
        <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
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
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
                  <FontAwesome name="lock" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Mevcut şifrenizi girin"
                    secureTextEntry
                    placeholderTextColor={theme.colors.textTertiary}
                    value={passwordData.currentPassword}
                    onChangeText={text => setPasswordData({...passwordData, currentPassword: text})}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Yeni Şifre</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
                  <FontAwesome name="lock" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Yeni şifrenizi girin"
                    secureTextEntry
                    placeholderTextColor={theme.colors.textTertiary}
                    value={passwordData.newPassword}
                    onChangeText={text => setPasswordData({...passwordData, newPassword: text})}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Yeni Şifre (Tekrar)</Text>
                <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
                  <FontAwesome name="lock" size={14} color={theme.colors.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, { color: theme.colors.text }]}
                    placeholder="Yeni şifrenizi tekrar girin"
                    secureTextEntry
                    placeholderTextColor={theme.colors.textTertiary}
                    value={passwordData.confirmPassword}
                    onChangeText={text => setPasswordData({...passwordData, confirmPassword: text})}
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

