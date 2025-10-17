import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/images';

const getToken = () => localStorage.getItem('authToken');

const getMultipartHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'multipart/form-data',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const imageService = {

  // NORMAL USER , BUSINESS OWNER , ADMIN
  uploadProfileImage: async (imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(`${BASE_URL}/profile`, formData, {
        headers: getMultipartHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER , ADMIN
  uploadPlaceImage: async (placeId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(`${BASE_URL}/place/${placeId}`, formData, {
        headers: getMultipartHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // NORMAL USER , BUSINESS OWNER , ADMIN
  deleteProfileImage: async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/profile`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER , ADMIN
  deletePlaceImage: async (placeId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/place/${placeId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BACKENDDEKİ MenuController İÇİNDEKİ IMAGE KONULU ENDPOINTLER

  // BUSINESS OWNER
  uploadMenuItemImage: async (menuItemId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await axios.post(`http://localhost:8080/api/menu/items/${menuItemId}/image`, formData, {
        headers: getMultipartHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER
  deleteMenuItemImage: async (menuItemId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/menu/items/${menuItemId}/image`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
};

export default imageService;