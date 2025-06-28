// src/api/movements.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/movimientos/',
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

export interface IMovimiento {
  id?: string;
  numero: string;
  tipo: 'INGRESO' | 'SALIDA' | 'TRASLADO' | 'AJUSTE';
  cantidad: number;
  precio_unitario: number;
  documento_referencia: string;
  observaciones: string;
  fecha_movimiento: string;
  producto: number;
  lote: number;
  ubicacion_origen?: number;
  ubicacion_destino?: number;
  proyecto?: number;
  proveedor?: number;
  usuario?: number;
}

export const getMovimientos = async (): Promise<IMovimiento[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching movements:', error);
    throw error;
  }
};

export const getMovimiento = async (id: string): Promise<IMovimiento> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movement with id ${id}:`, error);
    throw error;
  }
};

export const createMovimiento = async (movimiento: Omit<IMovimiento, 'id'>): Promise<IMovimiento> => {
  try {
    const response = await api.post('', movimiento);
    return response.data;
  } catch (error) {
    console.error('Error creating movement:', error);
    throw error;
  }
};

export const updateMovimiento = async (id: string, movimiento: Partial<IMovimiento>): Promise<IMovimiento> => {
  try {
    const response = await api.put(`${id}/`, movimiento);
    return response.data;
  } catch (error) {
    console.error(`Error updating movement with id ${id}:`, error);
    throw error;
  }
};

export const deleteMovimiento = async (id: string): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting movement with id ${id}:`, error);
    throw error;
  }
};