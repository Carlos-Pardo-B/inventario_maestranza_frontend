// src/api/kitComponentes.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/componentes-kit/',
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

export interface IKitComponente {
  id?: number;
  cantidad: number;
  kit: number;
  producto: number;
}

export const getKitComponentes = async (): Promise<IKitComponente[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching kit components:', error);
    throw error;
  }
};

export const getKitComponente = async (id: number): Promise<IKitComponente> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching kit component with id ${id}:`, error);
    throw error;
  }
};

export const createKitComponente = async (componente: Omit<IKitComponente, 'id'>): Promise<IKitComponente> => {
  try {
    const response = await api.post('', componente);
    return response.data;
  } catch (error) {
    console.error('Error creating kit component:', error);
    throw error;
  }
};

export const updateKitComponente = async (id: number, componente: Partial<IKitComponente>): Promise<IKitComponente> => {
  try {
    const response = await api.put(`${id}/`, componente);
    return response.data;
  } catch (error) {
    console.error(`Error updating kit component with id ${id}:`, error);
    throw error;
  }
};

export const deleteKitComponente = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting kit component with id ${id}:`, error);
    throw error;
  }
};