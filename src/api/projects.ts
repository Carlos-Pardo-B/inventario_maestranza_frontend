// src/api/projects.ts
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000/api/proyectos/proyectos/',
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

export interface IResponsable {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  rol: string;
}

export interface IProyecto {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: 'PLANIFICADO' | 'EN_PROGRESO' | 'COMPLETADO' | 'CANCELADO';
  estado_display?: string;
  fecha_inicio: string;
  fecha_fin_estimada: string;
  fecha_fin_real?: string;
  responsable: number; // ID del responsable
  responsable_detail?: IResponsable;
}

export const getProyectos = async (): Promise<IProyecto[]> => {
  try {
    const response = await api.get('');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const getProyecto = async (id: number): Promise<IProyecto> => {
  try {
    const response = await api.get(`${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    throw error;
  }
};

export const createProyecto = async (proyecto: Omit<IProyecto, 'id' | 'responsable_detail'>): Promise<IProyecto> => {
  try {
    const response = await api.post('', proyecto);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProyecto = async (id: number, proyecto: Partial<IProyecto>): Promise<IProyecto> => {
  try {
    const response = await api.put(`${id}/`, proyecto);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with id ${id}:`, error);
    throw error;
  }
};

export const deleteProyecto = async (id: number): Promise<void> => {
  try {
    await api.delete(`${id}/`);
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    throw error;
  }
};

export const changeProjectStatus = async (id: number, newStatus: IProyecto['estado']): Promise<IProyecto> => {
  try {
    const response = await api.patch(`${id}/change_status/`, { estado: newStatus });
    return response.data;
  } catch (error) {
    console.error(`Error changing status for project with id ${id}:`, error);
    throw error;
  }
};