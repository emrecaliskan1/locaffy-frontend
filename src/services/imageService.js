import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/images`;

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    return null;
  }
};

const buildHeaders = async (contentType = 'application/json') => {
  const token = await getToken();
  return {
    'Content-Type': contentType,
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const imageService = {

  // NORMAL USER , BUSINESS OWNER , ADMIN
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const headers = await buildHeaders('multipart/form-data');
      const response = await axios.post(`${BASE_URL}/profile`, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER , ADMIN
  uploadPlaceImage: async (placeId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const headers = await buildHeaders('multipart/form-data');
      const response = await axios.post(`${BASE_URL}/place/${placeId}`, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // NORMAL USER , BUSINESS OWNER , ADMIN
  deleteProfileImage: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/profile`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER , ADMIN
  deletePlaceImage: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${BASE_URL}/place/${placeId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BACKENDDEKİ MenuController İÇİNDEKİ IMAGE KONULU ENDPOINTLER

  // BUSINESS OWNER
  uploadMenuItemImage: async (menuItemId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      const headers = await buildHeaders('multipart/form-data');
      const response = await axios.post(`${API_BASE_URL}/menu/items/${menuItemId}/image`, formData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER
  deleteMenuItemImage: async (menuItemId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.delete(`${API_BASE_URL}/menu/items/${menuItemId}/image`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default imageService;