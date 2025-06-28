// src/api/lots.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/lotes/',
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

export interface ILote {
  id?: number;
  cantidad_actual: number;
  esta_vencido: boolean;
  codigo: string;
  fecha_ingreso: string;
  fecha_vencimiento: string;
  precio_compra: number;
  cantidad_inicial: number;
  observaciones: string;
  producto: number;
  proveedor: number;
}

export const getLotes = async (): Promise<ILote[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching lots:', error);
    throw error;
  }
};

export const getLote = async (id: number): Promise<ILote> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lot with id ${id}:`, error);
    throw error;
  }
};

export const createLote = async (lote: Omit<ILote, 'id'>): Promise<ILote> => {
  try {
    const response = await api.post('', lote);
    return response.data;
  } catch (error) {
    console.error('Error creating lot:', error);
    throw error;
  }
};

export const updateLote = async (id: number, lote: Partial<ILote>): Promise<ILote> => {
  try {
    const response = await api.put(`${id}/`, lote);
    return response.data;
  } catch (error) {
    console.error(`Error updating lot with id ${id}:`, error);
    throw error;
  }
};

export const deleteLote = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting lot with id ${id}:`, error);
    throw error;
  }
};

export const checkVencimiento = async (id: number): Promise<{ esta_vencido: boolean }> => {
  try {
    const response = await api.get(`${id}/check_vencimiento/`);
    return response.data;
  } catch (error) {
    console.error(`Error checking expiration for lot ${id}:`, error);
    throw error;
  }
};