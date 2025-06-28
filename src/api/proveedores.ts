// src/api/proveedores.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/compras/proveedores/',
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

export interface IProveedor {
  id?: number;
  codigo: string;
  nombre: string;
  rut: string;
  direccion: string;
  telefono: string;
  email: string;
  contacto_principal: string;
  terminos_pago: string;
  activo: boolean;
  fecha_creacion?: string;
  fecha_modificacion?: string;
}

export const getProveedores = async (): Promise<IProveedor[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const getProveedor = async (id: number): Promise<IProveedor> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching supplier with id ${id}:`, error);
    throw error;
  }
};

export const createProveedor = async (proveedor: Omit<IProveedor, 'id' | 'fecha_creacion' | 'fecha_modificacion'>): Promise<IProveedor> => {
  try {
    const response = await api.post('', proveedor);
    return response.data;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

export const updateProveedor = async (id: number, proveedor: Partial<IProveedor>): Promise<IProveedor> => {
  try {
    const response = await api.put(`${id}/`, proveedor);
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier with id ${id}:`, error);
    throw error;
  }
};

export const deleteProveedor = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting supplier with id ${id}:`, error);
    throw error;
  }
};