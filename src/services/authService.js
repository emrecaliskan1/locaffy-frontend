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
    console.log(error);
  }
};

const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.log(error);
  }
};

const saveUserInfo = async (userInfo) => {
  try {
    await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
          'Content-Type': 'application/json'
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
      console.log('Register error:', error.response?.data || error.message);
      throw error;
    }
  },


  login: async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
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
      console.log('Login error:', error.response?.data || error.message);
      throw error;
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
      throw error.message;
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
      await removeToken();
      await removeUserInfo();
      console.log('Logout error:', error.response?.data || error.message);
      throw error;
    }
  },

  isLoggedIn: async () => {
    const token = await getToken();
    return !!token;
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