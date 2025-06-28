import axios from 'axios';

// Define el tipo para tu producto basado en el modelo de Django
export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  categoria: number;
  unidad_medida: string;
  precio_promedio: number;
  stock_minimo: number;
  stock_maximo: number;
  stock_actual?: number;
  requiere_reposicion?: boolean;
  // Agrega otros campos según tu modelo
}

// Configuración base de axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Ajusta según tu URL base
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Token ${localStorage.getItem('token')}` // Asume que guardas el token en localStorage
  }
});

export const ProductService = {
  // Obtener todos los productos
  async getProducts(): Promise<Producto[]> {
    try {
      const response = await api.get('/productos/');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  async getProductById(id: number): Promise<Producto> {
    try {
      const response = await api.get(`/productos/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Crear un nuevo producto
  async createProduct(productData: Omit<Producto, 'id'>): Promise<Producto> {
    try {
      const response = await api.post('/productos/', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Actualizar un producto
  async updateProduct(id: number, productData: Partial<Producto>): Promise<Producto> {
    try {
      const response = await api.patch(`/productos/${id}/`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  // Eliminar un producto
  async deleteProduct(id: number): Promise<void> {
    try {
      await api.delete(`/productos/${id}/`);
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  }
};