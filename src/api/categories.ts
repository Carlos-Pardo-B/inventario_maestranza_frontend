// src/api/categories.ts
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/categorias/',
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

export interface ICategory {
  id?: number;
  nombre: string;
  descripcion: string;
  codigo: string;
  activo: boolean;
}

export const getCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategory = async (id: number): Promise<ICategory> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (category: Omit<ICategory, 'id'>): Promise<ICategory> => {
  try {
    const response = await api.post('', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: number, category: Partial<ICategory>): Promise<ICategory> => {
  try {
    const response = await api.put(`${id}/`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};

export const toggleCategoryStatus = async (id: number, currentStatus: boolean): Promise<ICategory> => {
  try {
    const response = await api.patch(`${id}/`, { activo: !currentStatus });
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for category with id ${id}:`, error);
    throw error;
  }
};