// src/api/kits.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/kits/',
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

export interface IComponenteKit {
  id?: number;
  cantidad: number;
  producto: number;
  kit?: number;
}

export interface IKit {
  id?: number;
  componentes: IComponenteKit[];
  disponible: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  activo: boolean;
  fecha_creacion?: string;
}

export const getKits = async (): Promise<IKit[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching kits:', error);
    throw error;
  }
};

export const getKit = async (id: number): Promise<IKit> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching kit with id ${id}:`, error);
    throw error;
  }
};

export const createKit = async (kit: Omit<IKit, 'id' | 'fecha_creacion'>): Promise<IKit> => {
  try {
    const response = await api.post('', kit);
    return response.data;
  } catch (error) {
    console.error('Error creating kit:', error);
    throw error;
  }
};

export const updateKit = async (id: number, kit: Partial<IKit>): Promise<IKit> => {
  try {
    const response = await api.put(`${id}/`, kit);
    return response.data;
  } catch (error) {
    console.error(`Error updating kit with id ${id}:`, error);
    throw error;
  }
};

export const deleteKit = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting kit with id ${id}:`, error);
    throw error;
  }
};