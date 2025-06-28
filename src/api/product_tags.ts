// src/api/productTags.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/producto-etiquetas/',
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

export interface IProductoEtiqueta {
  id?: number;
  fecha_asignacion: string;
  producto: number;
  etiqueta: number;
}

export const getProductoTags = async (): Promise<IProductoEtiqueta[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching product tags:', error);
    throw error;
  }
};

export const getProductoTag = async (id: number): Promise<IProductoEtiqueta> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product tag with id ${id}:`, error);
    throw error;
  }
};

export const createProductoTag = async (productTag: Omit<IProductoEtiqueta, 'id'>): Promise<IProductoEtiqueta> => {
  try {
    const response = await api.post('', productTag);
    return response.data;
  } catch (error) {
    console.error('Error creating product tag:', error);
    throw error;
  }
};

export const updateProductoTag = async (id: number, productTag: Partial<IProductoEtiqueta>): Promise<IProductoEtiqueta> => {
  try {
    const response = await api.put(`${id}/`, productTag);
    return response.data;
  } catch (error) {
    console.error(`Error updating product tag with id ${id}:`, error);
    throw error;
  }
};

export const deleteProductoTag = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting product tag with id ${id}:`, error);
    throw error;
  }
};