import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/menu`;

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const menuService = {
  // PUBLIC 
  getPlaceMenu: async (placeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/place/${placeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  searchMenuItems: async (placeId, searchTerm) => {
    try {
      const response = await axios.get(`${BASE_URL}/place/${placeId}/search`, {
        params: { searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // BUSINESS OWNER
  getMyMenuItems: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-items`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // BUSINESS OWNER
  getMyCategories: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/my-categories`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // BUSINESS OWNER
  getMenuItemsByCategory: async (category) => {
    try {
      const response = await axios.get(`${BASE_URL}/my-items/category/${category}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // BUSINESS OWNER
  createMenuItem: async (menuItem) => {
    try {
      const response = await axios.post(`${BASE_URL}/items`, menuItem, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // BUSINESS OWNER
  updateMenuItem: async (menuItemId, menuItem) => {
    try {
      const response = await axios.put(`${BASE_URL}/items/${menuItemId}`, menuItem, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // BUSINESS OWNER
  deleteMenuItem: async (menuItemId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/items/${menuItemId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default menuService;