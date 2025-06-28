// src/pages/LotsPage.tsx
import { useEffect, useState } from 'react';
import {
  getLotes,
  createLote,
  updateLote,
  deleteLote,
  checkVencimiento,
  type ILote,
} from '../api/lots';
import AlmacenImg from '../assets/images/home/almacen.webp';

const LotsPage = () => {
  const [lotes, setLotes] = useState<ILote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentLote, setCurrentLote] = useState<ILote | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [loteToDelete, setLoteToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<ILote, 'id'>>({
    cantidad_actual: 0,
    esta_vencido: false,
    codigo: '',
    fecha_ingreso: new Date().toISOString(),
    fecha_vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    precio_compra: 0,
    cantidad_inicial: 0,
    observaciones: '',
    producto: 0,
    proveedor: 0
  });

  useEffect(() => {
    fetchLotes();
  }, []);

  const fetchLotes = async () => {
    try {
      setLoading(true);
      const data = await getLotes();
      setLotes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los lotes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentLote && currentLote.id) {
        await updateLote(currentLote.id, formData);
      } else {
        await createLote(formData);
      }
      fetchLotes();
      closeModal();
    } catch (err) {
      setError('Error al guardar el lote');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentLote(null);
    setFormData({
      cantidad_actual: 0,
      esta_vencido: false,
      codigo: '',
      fecha_ingreso: new Date().toISOString(),
      fecha_vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      precio_compra: 0,
      cantidad_inicial: 0,
      observaciones: '',
      producto: 0,
      proveedor: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (lote: ILote) => {
    setCurrentLote(lote);
    setFormData({
      cantidad_actual: lote.cantidad_actual,
      esta_vencido: lote.esta_vencido,
      codigo: lote.codigo,
      fecha_ingreso: lote.fecha_ingreso,
      fecha_vencimiento: lote.fecha_vencimiento,
      precio_compra: lote.precio_compra,
      cantidad_inicial: lote.cantidad_inicial,
      observaciones: lote.observaciones,
      producto: lote.producto,
      proveedor: lote.proveedor
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setLoteToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (loteToDelete) {
      try {
        await deleteLote(loteToDelete);
        fetchLotes();
      } catch (err) {
        setError('Error al eliminar el lote');
        console.error(err);
      } finally {
        setShowDeleteAlert(false);
        setLoteToDelete(null);
      }
    }
  };

  const handleCheckVencimiento = async (id: number) => {
    try {
      const { esta_vencido } = await checkVencimiento(id);
      setLotes(lotes.map(lote => 
        lote.id === id ? { ...lote, esta_vencido } : lote
      ));
    } catch (err) {
      setError('Error al verificar vencimiento');
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
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
                Administración de Lotes
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
              >
                Nuevo Lote
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimiento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lotes.map((lote) => (
                      <tr key={lote.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{lote.codigo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{lote.producto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lote.cantidad_actual} / {lote.cantidad_inicial}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(lote.fecha_vencimiento)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${lote.esta_vencido ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
                          >
                            {lote.esta_vencido ? 'Vencido' : 'Vigente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(lote)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleCheckVencimiento(lote.id!)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Verificar Vencimiento"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(lote.id!)}
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
      
      {/* Modal de Lote */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentLote ? 'Editar Lote' : 'Nuevo Lote'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="codigo">
                      Código *
                    </label>
                    <input
                      type="text"
                      id="codigo"
                      name="codigo"
                      value={formData.codigo}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cantidad_inicial">
                      Cantidad Inicial *
                    </label>
                    <input
                      type="number"
                      id="cantidad_inicial"
                      name="cantidad_inicial"
                      value={formData.cantidad_inicial}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="cantidad_actual">
                      Cantidad Actual *
                    </label>
                    <input
                      type="number"
                      id="cantidad_actual"
                      name="cantidad_actual"
                      value={formData.cantidad_actual}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="precio_compra">
                      Precio Compra
                    </label>
                    <input
                      type="number"
                      id="precio_compra"
                      name="precio_compra"
                      value={formData.precio_compra}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
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
                      value={formData.proveedor}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_ingreso">
                      Fecha Ingreso *
                    </label>
                    <input
                      type="datetime-local"
                      id="fecha_ingreso"
                      name="fecha_ingreso"
                      value={formData.fecha_ingreso.substring(0, 16)}
                      onChange={handleDateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_vencimiento">
                      Fecha Vencimiento *
                    </label>
                    <input
                      type="date"
                      id="fecha_vencimiento"
                      name="fecha_vencimiento"
                      value={formData.fecha_vencimiento}
                      onChange={handleDateChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="esta_vencido"
                      name="esta_vencido"
                      checked={formData.esta_vencido}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="esta_vencido" className="ml-2 block text-sm text-gray-700">
                      ¿Está vencido?
                    </label>
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
                    {currentLote ? 'Actualizar' : 'Crear'}
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
            <p className="mb-6">¿Estás seguro que deseas eliminar este lote?</p>
            
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

export default LotsPage;