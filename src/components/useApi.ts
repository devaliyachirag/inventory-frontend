import { useCallback } from 'react';
import axiosInstance from '../components/axiosInstance';

const useAuthApi = () => {
  const token = localStorage.getItem('token');

  const api = useCallback(async (method:any, url:any, data = null) => {
    try {
      const response = await axiosInstance({
        method,
        url:`http://localhost:5050${url}`,
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  }, [token]);

  return api;
};

export default useAuthApi;
