import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/auth`;

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    return null;
  }
};

const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token);
  } catch (error) {
    // Token kaydetme hatası
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    // Token silme hatası
  }
};

const saveUserInfo = async (userInfo) => {
  try {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    // User info kaydetme hatası
  }
};

const getUserInfo = async () => {
  try {
    const userInfo = await AsyncStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    return null;
  }
};

const removeUserInfo = async () => {
  try {
    await AsyncStorage.removeItem('userInfo');
  } catch (error) {
    // User info silme hatası
  }
};

export const authService = {

  register: async (username, email, password, passwordConfirm) => {
    try {
      const requestBody = {
        username,
        email,
        password,
        passwordConfirm
      };
      const response = await axios.post(`${BASE_URL}/register`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data.accessToken) {
        await saveToken(response.data.accessToken);
        // Kullanıcı bilgilerini kaydet (JwtResponse'dan)
        await saveUserInfo({
          username: response.data.username,
          email: response.data.email,
          userId: response.data.userId
        });
      }
      return response.data;
    } catch (error) {
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Kayıt olurken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },


  login: async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data.accessToken) {
        await saveToken(response.data.accessToken);
        // Kullanıcı bilgilerini kaydet (JwtResponse'dan)
        await saveUserInfo({
          username: response.data.username,
          email: response.data.email,
          userId: response.data.userId
        });
      }
      return response.data;
    } catch (error) {
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Giriş yapılırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },


  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`${BASE_URL}/refresh`, {
        refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.accessToken) {
        saveToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Oturum yenilenirken hata oluştu';
      throw new Error(errorMessage);
    }
  },


  logout: async (userId) => {
    try {
      const token = await getToken();
      const response = await axios.post(`${BASE_URL}/logout?userId=${userId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      await removeToken();
      await removeUserInfo();
      return response.data;
    } catch (error) {
      // Hata olsa bile local token'ları temizle
      await removeToken();
      await removeUserInfo();
      // Backend ErrorResponse formatını handle et
      const errorMessage = error.response?.data?.message || 'Çıkış yapılırken bir hata oluştu';
      throw new Error(errorMessage);
    }
  },

  isLoggedIn: async () => {
    const token = await getToken();
    return !!token;
  },

  // Token geçerliliğini kontrol et
  validateToken: async () => {
    try {
      const token = await getToken();
      if (!token) return false;
      
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/validate`, { headers });
      return response.status === 200;
    } catch (error) {
      console.log('Token validation failed:', error);
      // Token geçersizse temizle
      await removeToken();
      await removeUserInfo();
      return false;
    }
  },

  clearToken: async () => {
    await removeToken();
    await removeUserInfo();
  },

  getUserInfo: async () => {
    return await getUserInfo();
  }
};

export default authService;