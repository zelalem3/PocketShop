
import axios from 'axios';
import { getAuth, getIdToken } from '@react-native-firebase/auth';
import { API_BASE_URL } from '../../config/apiConfig';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async config => {
    const currentUser = getAuth().currentUser;

    if (currentUser) {
      const token = await getIdToken(currentUser);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);
