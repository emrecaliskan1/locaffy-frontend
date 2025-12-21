import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  StatusBar,
  ActivityIndicator,
  Image,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Toast from '../../components/Toast';
import { useToast, useForm, useFadeSlideAnimation } from '../../hooks';

export default function AuthScreen({ navigation }) {
  const { login, register, loading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const { fadeAnim, slideAnim, animateIn } = useFadeSlideAnimation(0, 50, 600);
  const { values: formData, handleChange: handleInputChange } = useForm({
    email: '',
    password: '',
    username: '',
    phoneNumber: '',
    passwordConfirm: ''
  });

  useEffect(() => {
    if (loading) {
      if (activeTab === 'login') {
        showToast('Giriş yapılıyor...', 'info');
      } else {
        showToast('Kayıt işlemi yapılıyor...', 'info');
      }
    }
  }, [loading, activeTab]);

  // Animasyonları başlat
  useEffect(() => {
    animateIn();
  }, []);

  // Giriş işlemini gerçekleştir
  const handleLogin = async () => {
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        showToast('Giriş yapıldı', 'success');
      } else {
        showToast(result.message || 'Giriş başarısız', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Giriş yapılırken bir hata oluştu', 'error');
    }
  };

  // Kayıt işlemini gerçekleştir
  const handleRegister = async () => {
    try {
      const result = await register(
        formData.username,
        formData.email,
        formData.phoneNumber,
        formData.password, 
        formData.passwordConfirm
      );
      if (result.success) {
        showToast('Kayıt başarılı', 'success');
      } else {
        showToast(result.message || 'Kayıt başarısız', 'error');
      }
    } catch (error) {
      showToast(error.message || 'Kayıt yapılırken bir hata oluştu', 'error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            {/* Illustration Area */}
            <View style={styles.illustrationContainer}>
              <View style={styles.illustrationPlaceholder}>
                <FontAwesome name={activeTab === 'login' ? 'lock' : 'user-plus'} size={40} color="rgba(255,255,255,0.3)" />
              </View>
            </View>

            <View style={[styles.card, { backgroundColor: 'transparent' }]}>
              {activeTab === 'login' ? (
                // LOGIN SCREEN
                <View style={styles.formContainer}>
                  <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Giriş Yap</Text>
                  <Text style={[styles.screenSubtitle, { color: theme.colors.textSecondary }]}>Devam etmek için giriş yapın.</Text>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="envelope" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="E-posta"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="lock" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Şifre"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rememberMeContainer}>
                    <Text style={[styles.rememberMeText, { color: theme.colors.textSecondary }]}>Beni hatırla</Text>
                    <Switch
                      value={rememberMe}
                      onValueChange={setRememberMe}
                      trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
                      thumbColor={rememberMe ? '#FFFFFF' : '#F3F4F6'}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }, loading && styles.disabledButton]} 
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Giriş Yap</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.linkContainer}>
                    <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>Hesabın yok mu? </Text>
                    <TouchableOpacity onPress={() => setActiveTab('register')}>
                      <Text style={[styles.linkButton, { color: theme.colors.primary }]}>Kayıt Ol</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // REGISTER SCREEN
                <View style={styles.formContainer}>
                  <Text style={[styles.screenTitle, { color: theme.colors.text }]}>Kayıt Ol</Text>
                  <Text style={[styles.screenSubtitle, { color: theme.colors.textSecondary }]}>Giriş yapmak için kayıt olun.</Text>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="user" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Kullanıcı Adı"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="envelope" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="E-posta"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="phone" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Telefon Numarası"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.phoneNumber}
                      onChangeText={(value) => handleInputChange('phoneNumber', value)}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="lock" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Şifre (en az 6 karakter)"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: theme.isDarkMode ? theme.colors.surface : '#F5F5F5' }]}>
                    <FontAwesome name="lock" size={18} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Şifre Tekrar"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.passwordConfirm}
                      onChangeText={(value) => handleInputChange('passwordConfirm', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={18} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rememberMeContainer}>
                    <Text style={[styles.rememberMeText, { color: theme.colors.textSecondary }]}>Beni hatırla</Text>
                    <Switch
                      value={rememberMe}
                      onValueChange={setRememberMe}
                      trackColor={{ false: '#D1D5DB', true: theme.colors.primary }}
                      thumbColor={rememberMe ? '#FFFFFF' : '#F3F4F6'}
                    />
                  </View>

                  <TouchableOpacity 
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }, loading && styles.disabledButton]} 
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Kayıt Ol</Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.linkContainer}>
                    <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>Zaten hesabın var mı? </Text>
                    <TouchableOpacity onPress={() => setActiveTab('login')}>
                      <Text style={[styles.linkButton, { color: theme.colors.primary }]}>Giriş Yap</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        duration={toast.type === 'info' ? 5000 : 1000}
        onHide={hideToast}
      />
    </View>
  );
}

