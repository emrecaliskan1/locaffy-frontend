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
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { styles } from './styles';

export default function AuthScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

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

  const handleLogin = () => {
    navigation.replace('Main');
  };

  const handleRegister = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
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

            <View style={styles.card}>
 
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'login' && styles.activeTab]}
                onPress={() => setActiveTab('login')}
              >
                <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>
                  Giriş Yap
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'register' && styles.activeTab]}
                onPress={() => setActiveTab('register')}
              >
                <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>
                  Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>


            <View style={styles.formContainer}>
              {activeTab === 'login' ? (
  
                <View>
  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="E-posta"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Şifre"
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                    <Text style={styles.primaryButtonText}>Giriş Yap</Text>
                  </TouchableOpacity>

                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Hesabın yok mu? </Text>
                    <TouchableOpacity onPress={() => setActiveTab('register')}>
                      <Text style={styles.linkButton}>Kayıt Ol</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (


                <View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ad Soyad"
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📱</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Telefon Numarası"
                      value={formData.phone}
                      onChangeText={(value) => handleInputChange('phone', value)}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="E-posta"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Şifre"
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                    <Text style={styles.primaryButtonText}>Hesap Oluştur</Text>
                  </TouchableOpacity>

                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}>Zaten hesabın var mı? </Text>
                    <TouchableOpacity onPress={() => setActiveTab('login')}>
                      <Text style={styles.linkButton}>Giriş Yap</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

