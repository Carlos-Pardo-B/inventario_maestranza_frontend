// src/pages/MovementsPage.tsx
import { useEffect, useState } from 'react';
import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
  type IMovimiento,
} from '../api/movements';
import AlmacenImg from '../assets/images/home/almacen.webp';

const MovementsPage = () => {
  const [movimientos, setMovimientos] = useState<IMovimiento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentMovimiento, setCurrentMovimiento] = useState<IMovimiento | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [movimientoToDelete, setMovimientoToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<IMovimiento, 'id'>>({
    numero: '',
    tipo: 'INGRESO',
    cantidad: 0,
    precio_unitario: 0,
    documento_referencia: '',
    observaciones: '',
    fecha_movimiento: new Date().toISOString(),
    producto: 0,
    lote: 0,
    ubicacion_origen: undefined,
    ubicacion_destino: undefined,
    proyecto: undefined,
    proveedor: undefined,
    usuario: 0
  });

  useEffect(() => {
    fetchMovimientos();
  }, []);

  const fetchMovimientos = async () => {
    try {
      setLoading(true);
      const data = await getMovimientos();
      setMovimientos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los movimientos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentMovimiento && currentMovimiento.id) {
        await updateMovimiento(currentMovimiento.id, formData);
      } else {
        await createMovimiento(formData);
      }
      fetchMovimientos();
      closeModal();
    } catch (err) {
      setError('Error al guardar el movimiento');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentMovimiento(null);
    setFormData({
      numero: '',
      tipo: 'INGRESO',
      cantidad: 0,
      precio_unitario: 0,
      documento_referencia: '',
      observaciones: '',
      fecha_movimiento: new Date().toISOString(),
      producto: 0,
      lote: 0,
      ubicacion_origen: undefined,
      ubicacion_destino: undefined,
      proyecto: undefined,
      proveedor: undefined,
      usuario: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (movimiento: IMovimiento) => {
    setCurrentMovimiento(movimiento);
    setFormData({
      numero: movimiento.numero,
      tipo: movimiento.tipo,
      cantidad: movimiento.cantidad,
      precio_unitario: movimiento.precio_unitario,
      documento_referencia: movimiento.documento_referencia,
      observaciones: movimiento.observaciones,
      fecha_movimiento: movimiento.fecha_movimiento,
      producto: movimiento.producto,
      lote: movimiento.lote,
      ubicacion_origen: movimiento.ubicacion_origen,
      ubicacion_destino: movimiento.ubicacion_destino,
      proyecto: movimiento.proyecto,
      proveedor: movimiento.proveedor,
      usuario: movimiento.usuario || 0
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (id: string) => {
    setMovimientoToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (movimientoToDelete) {
      try {
        await deleteMovimiento(movimientoToDelete);
        fetchMovimientos();
      } catch (err) {
        setError('Error al eliminar el movimiento');
        console.error(err);
      } finally {
        setShowDeleteAlert(false);
        setMovimientoToDelete(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoDisplay = (tipo: string) => {
    switch(tipo) {
      case 'INGRESO': return 'Ingreso';
      case 'SALIDA': return 'Salida';
      case 'TRASLADO': return 'Traslado';
      case 'AJUSTE': return 'Ajuste';
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch(tipo) {
      case 'INGRESO': return 'bg-green-100 text-green-800';
      case 'SALIDA': return 'bg-red-100 text-red-800';
      case 'TRASLADO': return 'bg-blue-100 text-blue-800';
      case 'AJUSTE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Registro de Movimientos
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
              >
                Nuevo Movimiento
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {movimientos.map((movimiento) => (
                      <tr key={movimiento.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{movimiento.numero}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(movimiento.tipo)}`}>
                            {getTipoDisplay(movimiento.tipo)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{movimiento.producto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{movimiento.cantidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(movimiento.fecha_movimiento)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(movimiento)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(movimiento.id!)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Movimiento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentMovimiento ? 'Editar Movimiento' : 'Nuevo Movimiento'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="numero">
                      Número *
                    </label>
                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tipo">
                      Tipo *
                    </label>
                    <select
                      id="tipo"
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="INGRESO">Ingreso</option>
                      <option value="SALIDA">Salida</option>
                      <option value="TRASLADO">Traslado</option>
                      <option value="AJUSTE">Ajuste</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cantidad">
                      Cantidad *
                    </label>
                    <input
                      type="number"
                      id="cantidad"
                      name="cantidad"
                      value={formData.cantidad}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="precio_unitario">
                      Precio Unitario
                    </label>
                    <input
                      type="number"
                      id="precio_unitario"
                      name="precio_unitario"
                      value={formData.precio_unitario}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="documento_referencia">
                      Documento Referencia
                    </label>
                    <input
                      type="text"
                      id="documento_referencia"
                      name="documento_referencia"
                      value={formData.documento_referencia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_movimiento">
                      Fecha Movimiento *
                    </label>
                    <input
                      type="datetime-local"
                      id="fecha_movimiento"
                      name="fecha_movimiento"
                      value={formData.fecha_movimiento.substring(0, 16)}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="producto">
                      ID Producto *
                    </label>
                    <input
                      type="number"
                      id="producto"
                      name="producto"
                      value={formData.producto}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lote">
                      ID Lote *
                    </label>
                    <input
                      type="number"
                      id="lote"
                      name="lote"
                      value={formData.lote}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                    />
                  </div>
                  
                  {formData.tipo === 'TRASLADO' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ubicacion_origen">
                          Ubicación Origen *
                        </label>
                        <input
                          type="number"
                          id="ubicacion_origen"
                          name="ubicacion_origen"
                          value={formData.ubicacion_origen || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required={formData.tipo === 'TRASLADO'}
                          min="0"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="ubicacion_destino">
                          Ubicación Destino *
                        </label>
                        <input
                          type="number"
                          id="ubicacion_destino"
                          name="ubicacion_destino"
                          value={formData.ubicacion_destino || ''}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required={formData.tipo === 'TRASLADO'}
                          min="0"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="proyecto">
                      ID Proyecto
                    </label>
                    <input
                      type="number"
                      id="proyecto"
                      name="proyecto"
                      value={formData.proyecto || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="proveedor">
                      ID Proveedor
                    </label>
                    <input
                      type="number"
                      id="proveedor"
                      name="proveedor"
                      value={formData.proveedor || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="observaciones">
                      Observaciones
                    </label>
                    <textarea
                      id="observaciones"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
                  >
                    {currentMovimiento ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de Eliminación */}
      {showDeleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteAlert(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">¿Estás seguro que deseas eliminar este movimiento?</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteAlert(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-md shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementsPage;