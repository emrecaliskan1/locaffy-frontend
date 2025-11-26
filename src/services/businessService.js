import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const BUSINESS_URL = `${API_BASE_URL}/business`;
const APPLICATION_URL = `${API_BASE_URL}/business-applications`;

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (e) {
    return null;
  }
};

const buildHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// İŞLETME SAHİBİ İŞLEMLERİ

export const businessService = {

  // BUSINESS OWNER
  getMyPlaces: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BUSINESS_URL}/places`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER 
  updatePlace: async (placeId, placeData) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BUSINESS_URL}/places/${placeId}`, placeData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER 
  updateOccupancyRate: async (placeId, occupancyRate) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${BUSINESS_URL}/places/${placeId}/occupancy`, null, {
        params: { occupancyRate },
        headers
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // BUSINESS OWNER 
  getPlaceMenu: async (placeId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${BUSINESS_URL}/places/${placeId}/menu`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};


// İŞLETME BAŞVURU SERVİSLERİ

export const businessApplicationService = {

  // PUBLIC 
  submitApplication: async (applicationData) => {
    try {
      const response = await axios.post(`${APPLICATION_URL}`, applicationData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADMIN 
  getPendingApplications: async () => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${APPLICATION_URL}/pending`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADMIN 
  getApplicationById: async (applicationId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.get(`${APPLICATION_URL}/${applicationId}`, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADMIN 
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${APPLICATION_URL}/${applicationId}/status`, statusData, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADMIN 
  approveApplication: async (applicationId) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${APPLICATION_URL}/${applicationId}/approve`, {}, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ADMIN 
  rejectApplication: async (applicationId, rejectionReason) => {
    try {
      const headers = await buildHeaders();
      const response = await axios.put(`${APPLICATION_URL}/${applicationId}/reject`, {
        rejectionReason
      }, { headers });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default { businessService, businessApplicationService };