import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/admin`;

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const adminService = {
  
  // TÜM ENDPOINTLER ADMIN YETKİSİ GEREKTİRİR.
  getAllPlaces: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/places`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  deletePlace: async (placeId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/places/${placeId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },
  
  togglePlaceStatus: async (placeId) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: `${BASE_URL}/places/${placeId}/toggle-status`,
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },
  
  toggleUserStatus: async (userId) => {
    try {
      const response = await axios({
        method: 'PUT',
        url: `${BASE_URL}/users/${userId}/toggle-status`,
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
};

export default adminService;