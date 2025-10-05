import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useState } from 'react';
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>🍽️</Text>
            </View>
            <Text style={styles.title}>Hoş Geldin</Text>
            <Text style={styles.subtitle}>
              {activeTab === 'login' 
                ? 'Hesabına giriş yap ve lezzetli yolculuğuna devam et'
                : 'Yeni hesap oluştur ve lezzetli dünyamıza katıl'
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

                // Register Form
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

