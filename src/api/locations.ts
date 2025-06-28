// src/api/locations.ts
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/ubicaciones/',
});

// Interceptor para añadir el token a cada solicitud
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export interface IUbicacion {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  seccion: string;
  pasillo: string;
  estante: string;
  nivel: string;
  activo: boolean;
}

export const getUbicaciones = async (): Promise<IUbicacion[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const getUbicacion = async (id: number): Promise<IUbicacion> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching location with id ${id}:`, error);
    throw error;
  }
};

export const createUbicacion = async (ubicacion: Omit<IUbicacion, 'id'>): Promise<IUbicacion> => {
  try {
    const response = await api.post('', ubicacion);
    return response.data;
  } catch (error) {
    console.error('Error creating location:', error);
    throw error;
  }
};

export const updateUbicacion = async (id: number, ubicacion: Partial<IUbicacion>): Promise<IUbicacion> => {
  try {
    const response = await api.put(`${id}/`, ubicacion);
    return response.data;
  } catch (error) {
    console.error(`Error updating location with id ${id}:`, error);
    throw error;
  }
};

export const deleteUbicacion = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting location with id ${id}:`, error);
    throw error;
  }
};

export const toggleUbicacionStatus = async (id: number, currentStatus: boolean): Promise<IUbicacion> => {
  try {
    const response = await api.patch(`${id}/`, { activo: !currentStatus });
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for location with id ${id}:`, error);
    throw error;
  }
};