import axios from 'axios';

const axiosAdmin = axios.create({
  baseURL: '/api/admin',
});

axiosAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAdmin;
