// src/api/tags.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/etiquetas/',
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

export interface IEtiqueta {
  id?: number;
  nombre: string;
  color: string;
  descripcion: string;
}

export const getEtiquetas = async (): Promise<IEtiqueta[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

export const getEtiqueta = async (id: number): Promise<IEtiqueta> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tag with id ${id}:`, error);
    throw error;
  }
};

export const createEtiqueta = async (etiqueta: Omit<IEtiqueta, 'id'>): Promise<IEtiqueta> => {
  try {
    const response = await api.post('', etiqueta);
    return response.data;
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

export const updateEtiqueta = async (id: number, etiqueta: Partial<IEtiqueta>): Promise<IEtiqueta> => {
  try {
    const response = await api.put(`${id}/`, etiqueta);
    return response.data;
  } catch (error) {
    console.error(`Error updating tag with id ${id}:`, error);
    throw error;
  }
};

export const deleteEtiqueta = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting tag with id ${id}:`, error);
    throw error;
  }
};