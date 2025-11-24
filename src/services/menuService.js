import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/menu`;

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    return null;
  }
};

const buildHeaders = async (extra = {}) => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extra,
  };
};

export const menuService = {
  // PUBLIC 
  getPlaceMenu: async (placeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/place/${placeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchMenuItems: async (placeId, searchTerm) => {
    try {
      const response = await axios.get(`${BASE_URL}/place/${placeId}/search`, {
        params: { searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  getMyMenuItems: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-items`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  getMyCategories: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-categories`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  getMenuItemsByCategory: async (category) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BASE_URL}/my-items/category/${category}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  createMenuItem: async (menuItem) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.post(`${BASE_URL}/items`, menuItem, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  updateMenuItem: async (menuItemId, menuItem) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BASE_URL}/items/${menuItemId}`, menuItem, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  deleteMenuItem: async (menuItemId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/items/${menuItemId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default menuService;