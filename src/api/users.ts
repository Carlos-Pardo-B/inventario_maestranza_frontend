// src/api/usuarios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/usuarios/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface IUsuario {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  rol: string;
  rol_display: string;
  telefono: string;
  activo: boolean;
  fecha_creacion?: string;
}

export const getUsuarios = async (filtros?: {rol?: string, activo?: boolean}): Promise<IUsuario[]> => {
  try {
    // Convertimos los filtros a parámetros de URL
    const params = new URLSearchParams();
    
    if (filtros?.rol !== undefined) {
      params.append('rol', filtros.rol);
    }
    
    if (filtros?.activo !== undefined) {
      params.append('activo', filtros.activo.toString());
    }

    const response = await api.get('', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUsuario = async (id: number): Promise<IUsuario> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const createUsuario = async (usuario: Omit<IUsuario, 'id' | 'fecha_creacion' | 'rol_display'>): Promise<IUsuario> => {
  try {
    const response = await api.post('', usuario);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUsuario = async (id: number, usuario: Partial<IUsuario>): Promise<IUsuario> => {
  try {
    const response = await api.put(`${id}/`, usuario);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with id ${id}:`, error);
    throw error;
  }
};

export const deleteUsuario = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting user with id ${id}:`, error);
    throw error;
  }
};