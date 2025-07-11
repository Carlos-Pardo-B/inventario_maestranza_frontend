// src/pages/ProductsPage.tsx
import { useEffect, useState } from 'react';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  type IProducto,
} from '../api/products';
import AlmacenImg from '../assets/images/home/almacen.webp';

const ProductsPage = () => {
  const [products, setProducts] = useState<IProducto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<IProducto | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<IProducto, 'id'>>({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: 0,
    unidad_medida: 'unidad',
    precio_promedio: 0,
    stock_minimo: 0,
    stock_maximo: 0,
    activo: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProduct && currentProduct.id) {
        await updateProduct(currentProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentProduct(null);
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      categoria: 0,
      unidad_medida: 'unidad',
      precio_promedio: 0,
      stock_minimo: 0,
      stock_maximo: 0,
      activo: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: IProducto) => {
    setCurrentProduct(product);
    setFormData({
      codigo: product.codigo,
      nombre: product.nombre,
      descripcion: product.descripcion,
      categoria: product.categoria,
      unidad_medida: product.unidad_medida,
      precio_promedio: product.precio_promedio,
      stock_minimo: product.stock_minimo,
      stock_maximo: product.stock_maximo,
      activo: product.activo ?? true
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setProductToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        fetchProducts();
      } catch (err) {
        setError('Error al eliminar el producto');
        console.error(err);
      } finally {
        setShowDeleteAlert(false);
        setProductToDelete(null);
      }
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await toggleProductStatus(id, currentStatus);
      fetchProducts();
    } catch (err) {
      setError('Error al cambiar el estado del producto');
      console.error(err);
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
                Administración de Productos
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
              >
                Nuevo Producto
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{product.codigo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{product.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${product.precio_promedio}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${(product.stock_actual || 0) < (product.stock_minimo || 0) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {product.stock_actual} / {product.stock_maximo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${product.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {product.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(product.id!, product.activo || false)}
                            className={`${product.activo ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                            title={product.activo ? 'Desactivar' : 'Activar'}
                          >
                            {product.activo ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => confirmDelete(product.id!)}
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
      
      {/* Modal de Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentProduct ? 'Editar Producto' : 'Nuevo Producto'}
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
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="descripcion">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="unidad_medida">
                      Unidad de Medida *
                    </label>
                    <select
                      id="unidad_medida"
                      name="unidad_medida"
                      value={formData.unidad_medida}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="unidad">Unidad</option>
                      <option value="kg">Kilogramo</option>
                      <option value="g">Gramo</option>
                      <option value="l">Litro</option>
                      <option value="ml">Mililitro</option>
                      <option value="m">Metro</option>
                      <option value="cm">Centímetro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="precio_promedio">
                      Precio Promedio *
                    </label>
                    <input
                      type="number"
                      id="precio_promedio"
                      name="precio_promedio"
                      value={formData.precio_promedio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock_minimo">
                      Stock Mínimo *
                    </label>
                    <input
                      type="number"
                      id="stock_minimo"
                      name="stock_minimo"
                      value={formData.stock_minimo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock_maximo">
                      Stock Máximo *
                    </label>
                    <input
                      type="number"
                      id="stock_maximo"
                      name="stock_maximo"
                      value={formData.stock_maximo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      min="0"
                      required
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
                      Producto Activo
                    </label>
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
                    {currentProduct ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerta de Eliminación (centrada) */}
      {showDeleteAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteAlert(false)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Confirmar Eliminación</h2>
            <p className="mb-6">¿Estás seguro que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
            
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

export default ProductsPage;