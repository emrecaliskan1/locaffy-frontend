import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/places`;

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const placeService = {
  // PUBLIC 
  getNearbyPlaces: async (latitude, longitude, radius = 1000) => {
    try {
      const response = await axios.get(`${BASE_URL}/nearby`, {
        params: {
          latitude,
          longitude, 
          radius
        }
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // PUBLIC 
  getFilteredPlaces: async (placeType, minRating) => {
    try {
      const response = await axios.get(`${BASE_URL}/filter`, {
        params: {
          placeType,
          minRating
        }
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // PUBLIC
  getPlaceDetails: async (placeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/${placeId}`);
      return response.data;
    } catch (error) {
      throw error.message;
    }
  },

  // BUSINESS OWNER , ADMIN
  updateOccupancyRate: async (placeId, occupancyRate) => {
    try {
      const response = await axios.put(`${BASE_URL}/${placeId}/occupancy`, null, {
        params: { occupancyRate },
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.message;
    }
  }
};

export default placeService;