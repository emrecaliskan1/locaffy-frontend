import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/reviews';

const getToken = () => localStorage.getItem('authToken');

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const reviewService = {
    
  // USER
  createReview: async (reviewData) => {
    try {
      const response = await axios.post(`${BASE_URL}`, reviewData, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // PUBLIC
  getPlaceReviews: async (placeId) => {
    try {
      const response = await axios.get(`${BASE_URL}/place/${placeId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // USER
  deleteReview: async (reviewId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/${reviewId}`, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reviewService;