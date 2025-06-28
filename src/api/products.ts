// src/api/products.ts
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api/inventario/productos/',
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

export interface IProducto {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: number;  // ID de la categoría
  unidad_medida: string;
  precio_promedio: number;
  stock_minimo: number;
  stock_maximo: number;
  stock_actual?: number;
  requiere_reposicion?: boolean;
  activo?: boolean;
  // Puedes agregar más campos según necesites
}

export const getProducts = async (): Promise<IProducto[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (id: number): Promise<IProducto> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: Omit<IProducto, 'id'>): Promise<IProducto> => {
  try {
    const response = await api.post('', product);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: number, product: Partial<IProducto>): Promise<IProducto> => {
  try {
    const response = await api.put(`${id}/`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};

export const toggleProductStatus = async (id: number, currentStatus: boolean): Promise<IProducto> => {
  try {
    const response = await api.patch(`${id}/`, { activo: !currentStatus });
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for product with id ${id}:`, error);
    throw error;
  }
};

// Función adicional para manejar reposición de stock
export const requestRestock = async (id: number): Promise<IProducto> => {
  try {
    const response = await api.patch(`${id}/request_restock/`, {});
    return response.data;
  } catch (error) {
    console.error(`Error requesting restock for product ${id}:`, error);
    throw error;
  }
};