// src/pages/ProductTagsPage.tsx
import { useEffect, useState } from 'react';
import {
  getProductoTags,
  createProductoTag,
  updateProductoTag,
  deleteProductoTag,
  type IProductoEtiqueta,
} from '../api/product_tags';
import AlmacenImg from '../assets/images/home/almacen.webp';

const ProductTagsPage = () => {
  const [productTags, setProductTags] = useState<IProductoEtiqueta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProductTag, setCurrentProductTag] = useState<IProductoEtiqueta | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [productTagToDelete, setProductTagToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<IProductoEtiqueta, 'id'>>({
    fecha_asignacion: new Date().toISOString(),
    producto: 0,
    etiqueta: 0
  });

  useEffect(() => {
    fetchProductTags();
  }, []);

  const fetchProductTags = async () => {
    try {
      setLoading(true);
      const data = await getProductoTags();
      setProductTags(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las etiquetas de producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === 'producto' || name === 'etiqueta' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProductTag && currentProductTag.id) {
        await updateProductoTag(currentProductTag.id, formData);
      } else {
        await createProductoTag(formData);
      }
      fetchProductTags();
      closeModal();
    } catch (err) {
      setError('Error al guardar la relación producto-etiqueta');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentProductTag(null);
    setFormData({
      fecha_asignacion: new Date().toISOString(),
      producto: 0,
      etiqueta: 0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (productTag: IProductoEtiqueta) => {
    setCurrentProductTag(productTag);
    setFormData({
      fecha_asignacion: productTag.fecha_asignacion,
      producto: productTag.producto,
      etiqueta: productTag.etiqueta
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setProductTagToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (productTagToDelete) {
      try {
        await deleteProductoTag(productTagToDelete);
        fetchProductTags();
      } catch (err) {
        setError('Error al eliminar la relación producto-etiqueta');
        console.error(err);
      } finally {
        setShowDeleteAlert(false);
        setProductTagToDelete(null);
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
                Relaciones Producto-Etiqueta
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
              >
                Nueva Relación
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Etiqueta</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Asignación</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productTags.map((productTag) => (
                      <tr key={productTag.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{productTag.producto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{productTag.etiqueta}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(productTag.fecha_asignacion)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(productTag)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(productTag.id!)}
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
      
      {/* Modal de Producto-Etiqueta */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentProductTag ? 'Editar Relación' : 'Nueva Relación'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="etiqueta">
                    ID Etiqueta *
                  </label>
                  <input
                    type="number"
                    id="etiqueta"
                    name="etiqueta"
                    value={formData.etiqueta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_asignacion">
                    Fecha Asignación *
                  </label>
                  <input
                    type="datetime-local"
                    id="fecha_asignacion"
                    name="fecha_asignacion"
                    value={formData.fecha_asignacion.substring(0, 16)}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
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
                    {currentProductTag ? 'Actualizar' : 'Crear'}
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
            <p className="mb-6">¿Estás seguro que deseas eliminar esta relación producto-etiqueta?</p>
            
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

export default ProductTagsPage;