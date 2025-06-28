// src/pages/KitsPage.tsx
import { useEffect, useState } from 'react';
import {
  getKits,
  createKit,
  updateKit,
  deleteKit,
  type IKit,
  type IComponenteKit
} from '../api/kits';
import AlmacenImg from '../assets/images/home/almacen.webp';

const KitsPage = () => {
  const [kits, setKits] = useState<IKit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentKit, setCurrentKit] = useState<IKit | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [kitToDelete, setKitToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<IKit, 'id' | 'fecha_creacion'>>({
    componentes: [],
    disponible: '',
    codigo: '',
    nombre: '',
    descripcion: '',
    activo: true
  });

  useEffect(() => {
    fetchKits();
  }, []);

  const fetchKits = async () => {
    try {
      setLoading(true);
      const data = await getKits();
      setKits(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los kits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleComponenteChange = (index: number, field: keyof IComponenteKit, value: number) => {
    const newComponentes = [...formData.componentes];
    newComponentes[index] = {
      ...newComponentes[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      componentes: newComponentes
    });
  };

  const addComponente = () => {
    setFormData({
      ...formData,
      componentes: [...formData.componentes, { producto: 0, cantidad: 1 }]
    });
  };

  const removeComponente = (index: number) => {
    const newComponentes = [...formData.componentes];
    newComponentes.splice(index, 1);
    setFormData({
      ...formData,
      componentes: newComponentes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentKit && currentKit.id) {
        await updateKit(currentKit.id, formData);
      } else {
        await createKit(formData);
      }
      fetchKits();
      closeModal();
    } catch (err) {
      setError('Error al guardar el kit');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentKit(null);
    setFormData({
      componentes: [],
      disponible: '',
      codigo: '',
      nombre: '',
      descripcion: '',
      activo: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (kit: IKit) => {
    setCurrentKit(kit);
    setFormData({
      componentes: kit.componentes,
      disponible: kit.disponible,
      codigo: kit.codigo,
      nombre: kit.nombre,
      descripcion: kit.descripcion,
      activo: kit.activo
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setKitToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (kitToDelete) {
      try {
        await deleteKit(kitToDelete);
        fetchKits();
      } catch (err) {
        setError('Error al eliminar el kit');
        console.error(err);
      } finally {
        setShowDeleteAlert(false);
        setKitToDelete(null);
      }
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
                Administración de Kits
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
              >
                Nuevo Kit
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disponible</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componentes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kits.map((kit) => (
                      <tr key={kit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{kit.codigo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kit.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{kit.disponible}</td>
                        <td className="px-6 py-4 whitespace-normal max-w-xs">
                          {kit.componentes.length} componentes
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${kit.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {kit.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(kit)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(kit.id!)}
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
      
      {/* Modal de Kit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-y-auto" style={{ maxHeight: '90vh' }}>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentKit ? 'Editar Kit' : 'Nuevo Kit'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="nombre">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="disponible">
                      Disponible
                    </label>
                    <input
                      type="text"
                      id="disponible"
                      name="disponible"
                      value={formData.disponible}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="activo" className="ml-2 block text-sm text-gray-700">
                      Kit activo
                    </label>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Componentes *
                    </label>
                    <button
                      type="button"
                      onClick={addComponente}
                      className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      + Añadir componente
                    </button>
                  </div>
                  
                  {formData.componentes.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No hay componentes añadidos
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.componentes.map((componente, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 bg-gray-50 rounded">
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Producto ID</label>
                            <input
                              type="number"
                              value={componente.producto}
                              onChange={(e) => handleComponenteChange(index, 'producto', parseInt(e.target.value))}
                              className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                            <input
                              type="number"
                              value={componente.cantidad}
                              onChange={(e) => handleComponenteChange(index, 'cantidad', parseInt(e.target.value))}
                              className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                              required
                              min="1"
                            />
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => removeComponente(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {currentKit ? 'Actualizar' : 'Crear'}
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
            <p className="mb-6">¿Estás seguro que deseas eliminar este kit?</p>
            
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

export default KitsPage;