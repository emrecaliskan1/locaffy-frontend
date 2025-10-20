import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/auth`;

const getToken = () => localStorage.getItem('authToken');
const saveToken = (token) => localStorage.setItem('authToken', token);
const removeToken = () => localStorage.removeItem('authToken');

export const authService = {

  register: async (email, password, name) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, {
        email,
        password,
        name
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
        saveToken(response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      throw error.message;
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
      const token = getToken();
      const response = await axios.post(`${BASE_URL}/logout?userId=${userId}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      removeToken();
      return response.data;
    } catch (error) {
      removeToken();
      throw error.message;
    }
  },

  isLoggedIn: () => {
    return !!getToken();
  },

  clearToken: () => {
    removeToken();
  }
};

export default authService;