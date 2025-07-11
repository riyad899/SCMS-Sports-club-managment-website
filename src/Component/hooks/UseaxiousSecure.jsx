import axios from 'axios'
import { useAuth } from './AuthContext';

const axiousSecure = axios.create({
    baseURL: `http://localhost:5000`,
    withCredentials: true
});

// Set up interceptors once
let isInterceptorSet = false;

export const UseaxiousSecure = () => {
  const { user, logOut } = useAuth();

  // Only set up interceptors once to avoid duplicates
  if (!isInterceptorSet) {
    axiousSecure.interceptors.request.use(
      async (config) => {
        try {
          if (user) {
            // Get Firebase ID token
            const token = await user.getIdToken();

            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting Firebase token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiousSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const status = error.response?.status;
        if (status === 401) {
          // Token expired or invalid - logout user
          try {
            await logOut();
            window.location.href = '/login';
          } catch (logoutError) {
            console.error('Logout error:', logoutError);
            window.location.href = '/login';
          }
        } else if (status === 403) {
          // Forbidden - redirect to error page
          window.location.href = '/forbidden';
        }
        return Promise.reject(error);
      }
    );

    isInterceptorSet = true;
  }

  return axiousSecure;
}
