import axios from 'axios';

const API_BASE = '/api/inventario';

export interface AlertaStock {
  id: number;
  producto: number;
  producto_nombre: string;
  producto_codigo: string;
  nivel_alerta: 'MINIMO' | 'REGULAR' | 'MAXIMO';
  stock_actual: number;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESUELTA' | 'DESCARTADA';
  fecha_creacion: string;
  creada_por: number;
  creada_por_nombre: string;
  resuelta_por?: number;
  resuelta_por_nombre?: string;
  comentarios?: string;
}

export interface ProductoAlertas {
  id: number;
  codigo: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  stock_regular: number;
  stock_maximo: number;
  alertas_pendientes: number;
}

export const fetchAlertas = async (params = {}): Promise<AlertaStock[]> => {
  const response = await axios.get(`${API_BASE}/alertas/`, { params });
  return response.data;
};

export const fetchProductosCriticos = async (): Promise<ProductoAlertas[]> => {
  const response = await axios.get(`${API_BASE}/productos-alertas/criticos/`);
  return response.data;
};

export const resolverAlerta = async (id: number): Promise<void> => {
  await axios.post(`${API_BASE}/alertas/${id}/resolver/`);
};

export const descartarAlerta = async (id: number): Promise<void> => {
  await axios.post(`${API_BASE}/alertas/${id}/descartar/`);
};

export const fetchAlertasPendientes = async (): Promise<number> => {
  const response = await axios.get(`${API_BASE}/alertas/`, {
    params: { estado: 'PENDIENTE', limit: 1 }
  });
  return response.data.count;
};