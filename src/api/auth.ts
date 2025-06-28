// src/api/auth.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/usuarios/login/'; // Ajusta la URL

const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(API_URL, { username, password });
    if (response.data.access) {
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  } catch (error: any) {
    console.error('Error en login:', error.response?.data);
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export default {
  login,
  logout,
};