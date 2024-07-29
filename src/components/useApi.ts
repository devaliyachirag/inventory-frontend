import { useCallback } from 'react';
import axios from 'axios';
import axiosInstance from "../components/axiosInstance"

const useAuthApi = () => {
  const token = localStorage.getItem('token');
  const api = useCallback(async (method:any, url:any, data = null) => {
    
    try {
      const response = await axiosInstance({
        method,
        url:`${process.env.REACT_APP_BaseURL}${url}`,
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
