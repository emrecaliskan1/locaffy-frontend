import axios from 'axios';

const BUSINESS_URL = 'http://localhost:8080/api/business';
const APPLICATION_URL = 'http://localhost:8080/api/business-applications';

const getToken = () => localStorage.getItem('authToken');
const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// İŞLETME SAHİBİ İŞLEMLERİ

export const businessService = {

  // BUSINESS OWNER
  getMyPlaces: async () => {
    try {
      const response = await axios.get(`${BUSINESS_URL}/places`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER 
  updatePlace: async (placeId, placeData) => {
    try {
      const response = await axios.put(`${BUSINESS_URL}/places/${placeId}`, placeData, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER 
  updateOccupancyRate: async (placeId, occupancyRate) => {
    try {
      const response = await axios.put(`${BUSINESS_URL}/places/${placeId}/occupancy`, null, {
        params: { occupancyRate },
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER 
  getPlaceMenu: async (placeId) => {
    try {
      const response = await axios.get(`${BUSINESS_URL}/places/${placeId}/menu`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
};

// İŞLETME BAŞVURU SERVİSLERİ

export const businessApplicationService = {

  // PUBLIC 
  submitApplication: async (applicationData) => {
    try {
      const response = await axios.post(`${APPLICATION_URL}`, applicationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // ADMIN 
  getPendingApplications: async () => {
    try {
      const response = await axios.get(`${APPLICATION_URL}/pending`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // ADMIN 
  getApplicationById: async (applicationId) => {
    try {
      const response = await axios.get(`${APPLICATION_URL}/${applicationId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // ADMIN 
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await axios.put(`${APPLICATION_URL}/${applicationId}/status`, statusData, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // ADMIN 
  approveApplication: async (applicationId) => {
    try {
      const response = await axios.put(`${APPLICATION_URL}/${applicationId}/approve`, {}, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // ADMIN 
  rejectApplication: async (applicationId, rejectionReason) => {
    try {
      const response = await axios.put(`${APPLICATION_URL}/${applicationId}/reject`, {
        rejectionReason
      }, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
};

export default { businessService, businessApplicationService };