import { useState, useEffect } from 'react';
import { 
  fetchAlertas, 
  fetchProductosCriticos,
  resolverAlerta,
  descartarAlerta,
  fetchAlertasPendientes
} from '../api/alerts';
import { type AlertaStock, type ProductoAlertas } from '../api/alerts';
import AlmacenImg from '../assets/images/home/almacen.webp';

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [productosCriticos, setProductosCriticos] = useState<ProductoAlertas[]>([]);
  const [loading, setLoading] = useState({
    alertas: false,
    productos: false
  });
  const [totalPendientes, setTotalPendientes] = useState(0);
  const [selectedAlerta, setSelectedAlerta] = useState<AlertaStock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    loadAlertasPendientes();
  }, []);

  const loadData = async () => {
    setLoading({ alertas: true, productos: true });
    setError(null);
    try {
      const [alertasResponse, productosResponse] = await Promise.all([
        fetchAlertas({ estado: 'PENDIENTE' }),
        fetchProductosCriticos()
      ]);
      
      const alertasData = Array.isArray(alertasResponse) ? alertasResponse : [];
      const productosData = Array.isArray(productosResponse) ? productosResponse : [];
      
      setAlertas(alertasData);
      setProductosCriticos(productosData);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
      setError('Error al cargar los datos. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading({ alertas: false, productos: false });
    }
  };

  const loadAlertasPendientes = async () => {
    try {
      const count = await fetchAlertasPendientes();
      setTotalPendientes(typeof count === 'number' ? count : 0);
    } catch (error) {
      console.error('Error al contar alertas pendientes:', error);
    }
  };

  const handleResolverAlerta = async (id: number) => {
    try {
      await resolverAlerta(id);
      await loadData();
      await loadAlertasPendientes();
    } catch (error) {
      console.error('Error al resolver la alerta:', error);
      setError('Error al resolver la alerta');
    }
  };

  const handleDescartarAlerta = async (id: number) => {
    try {
      await descartarAlerta(id);
      await loadData();
      await loadAlertasPendientes();
    } catch (error) {
      console.error('Error al descartar la alerta:', error);
      setError('Error al descartar la alerta');
    }
  };

  const getTagColor = (nivel: string) => {
    switch(nivel) {
      case 'MINIMO': return 'bg-red-100 text-red-800';
      case 'REGULAR': return 'bg-yellow-100 text-yellow-800';
      case 'MAXIMO': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTagText = (nivel: string) => {
    switch(nivel) {
      case 'MINIMO': return 'Crítico';
      case 'REGULAR': return 'Advertencia';
      case 'MAXIMO': return 'Máximo';
      default: return nivel;
    }
  };

  if (error) {
    return (
      <div className="relative min-h-screen">
        <img 
          src={AlmacenImg} 
          alt="Almacén industrial" 
          className="fixed inset-0 w-full h-full object-cover brightness-50"
        />
        <div className="fixed inset-0 bg-black/30"></div>
        <div className="relative z-10 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8">
              <div className="p-4 bg-red-100 text-red-700 rounded-md text-sm mb-6">
                {error}
                <button 
                  onClick={() => loadData()}
                  className="ml-4 text-red-900 font-medium"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Fondo con imagen */}
      <img 
        src={AlmacenImg} 
        alt="Almacén industrial" 
        className="fixed inset-0 w-full h-full object-cover brightness-50"
      />
      
      {/* Overlay para mejor contraste */}
      <div className="fixed inset-0 bg-black/30"></div>
      
      {/* Contenido principal */}
      <div className="relative z-10 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contenedor del contenido */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              Gestión de Alertas de Stock
            </h1>
            
            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">Alertas Pendientes</h3>
                <p className={`text-3xl font-bold ${totalPendientes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {totalPendientes}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">Productos Críticos</h3>
                <p className={`text-3xl font-bold ${productosCriticos.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {productosCriticos.length}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h3 className="text-gray-500 text-sm font-medium">Alertas Críticas</h3>
                <p className="text-3xl font-bold text-red-600">
                  {alertas.filter(a => a.nivel_alerta === 'MINIMO').length}
                </p>
              </div>
            </div>

            {/* Tabla de Alertas */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel Alerta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading.alertas ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          </div>
                        </td>
                      </tr>
                    ) : alertas.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          No hay alertas pendientes
                        </td>
                      </tr>
                    ) : (
                      alertas.map((alerta) => (
                        <tr key={alerta.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{alerta.producto_nombre}</div>
                            <div className="text-sm text-gray-500">{alerta.producto_codigo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTagColor(alerta.nivel_alerta)}`}>
                              {getTagText(alerta.nivel_alerta)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {alerta.stock_actual}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(alerta.fecha_creacion).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => {
                                setSelectedAlerta(alerta);
                                setIsModalOpen(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Detalles"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleResolverAlerta(alerta.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Resolver"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDescartarAlerta(alerta.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Descartar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {isModalOpen && selectedAlerta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detalles de Alerta
              </h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Producto:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedAlerta.producto_nombre} ({selectedAlerta.producto_codigo})
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nivel de Alerta:</p>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTagColor(selectedAlerta.nivel_alerta)}`}>
                    {getTagText(selectedAlerta.nivel_alerta)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Actual:</p>
                  <p className="text-sm font-medium text-gray-900">{selectedAlerta.stock_actual}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fecha de Creación:</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedAlerta.fecha_creacion).toLocaleString()}
                  </p>
                </div>
                {selectedAlerta.comentarios && (
                  <div>
                    <p className="text-sm text-gray-500">Comentarios:</p>
                    <p className="text-sm font-medium text-gray-900">{selectedAlerta.comentarios}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleResolverAlerta(selectedAlerta.id);
                    setIsModalOpen(false);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
                >
                  Marcar como Resuelta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}