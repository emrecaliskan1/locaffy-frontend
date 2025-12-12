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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Toast from '../../components/Toast';

export default function AuthScreen({ navigation }) {
  const { login, register, loading } = useAuth();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phoneNumber: '',
    passwordConfirm: ''
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

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
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const startFloatAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim1, {
            toValue: -20,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim1, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim2, {
            toValue: -15,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim2, {
            toValue: 0,
            duration: 8000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    startFloatAnimation();
  }, []);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const hideToast = () => {
    setToast({ visible: false, message: '', type: 'success' });
  };

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
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.primary} />
      
      <Animated.View 
        style={[
          styles.floatingElement1,
          { transform: [{ translateY: floatAnim1 }] }
        ]} 
      />
      <Animated.View 
        style={[
          styles.floatingElement2,
          { transform: [{ translateY: floatAnim2 }] }
        ]} 
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }}
          >
            <View style={styles.header}>
              <Animated.View 
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <Text style={styles.logoText}>L</Text>
              </Animated.View>
              <Text style={styles.title}>Locaffy'e Hoş Geldin</Text>
              <Text style={styles.subtitle}>
                {activeTab === 'login' 
                  ? 'Hesabınıza giriş yapın ve sosyal deneyiminizi keşfedin'
                  : 'Yeni hesap oluşturun ve sosyal dünyamıza katılın'
                }
              </Text>
            </View>

            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
 
            <View style={[styles.tabContainer, { backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'login' && { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setActiveTab('login');
                }}
              >
                <Text style={[styles.tabText, { color: theme.colors.textSecondary }, activeTab === 'login' && { color: '#FFFFFF' }]}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'register' && { backgroundColor: theme.colors.primary }]}
                onPress={() => {
                  setActiveTab('register');
                }}
              >
                <Text style={[styles.tabText, { color: theme.colors.textSecondary }, activeTab === 'register' && { color: '#FFFFFF' }]}>
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>


            <View style={styles.formContainer}>
              
              {activeTab === 'login' ? (
  
                <View>
  
                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="envelope" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="E-posta"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

  
                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="lock" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="Şifre"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={16} color={theme.colors.textTertiary} style={styles.eyeIcon} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Şifremi Unuttum</Text>
                  </TouchableOpacity>

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


                <View>
                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="user" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="Kullanıcı Adı"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.username}
                      onChangeText={(value) => handleInputChange('username', value)}
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="envelope" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="E-posta"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="phone" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="Telefon Numarası"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.phoneNumber}
                      onChangeText={(value) => handleInputChange('phoneNumber', value)}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="lock" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="Şifre (en az 6 karakter)"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={16} color={theme.colors.textTertiary} style={styles.eyeIcon} />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.inputContainer, { backgroundColor: "#FFFFFF", borderColor: theme.colors.border }]}>
                    <FontAwesome name="lock" size={16} color={theme.colors.textTertiary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: "#000000" }]}
                      placeholder="Şifre Tekrar"
                      placeholderTextColor={theme.colors.textTertiary}
                      value={formData.passwordConfirm}
                      onChangeText={(value) => handleInputChange('passwordConfirm', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={16} color={theme.colors.textTertiary} style={styles.eyeIcon} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }, loading && styles.disabledButton]} 
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Hesap Oluştur</Text>
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

