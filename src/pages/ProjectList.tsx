// src/pages/ProjectsPage.tsx
import { useEffect, useState } from 'react';
import {
  getProyectos,
  createProyecto,
  updateProyecto,
  deleteProyecto,
  changeProjectStatus,
  type IProyecto,
} from '../api/projects';
import AlmacenImg from '../assets/images/home/almacen.webp';

const ProjectsPage = () => {
  const [proyectos, setProyectos] = useState<IProyecto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentProyecto, setCurrentProyecto] = useState<IProyecto | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState<boolean>(false);
  const [proyectoToDelete, setProyectoToDelete] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Omit<IProyecto, 'id' | 'responsable_detail' | 'estado_display'>>({
    codigo: '',
    nombre: '',
    descripcion: '',
    estado: 'PLANIFICADO',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin_estimada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    responsable: 0,
  });

  useEffect(() => {
    fetchProyectos();
  }, []);

  const fetchProyectos = async () => {
    try {
      setLoading(true);
      const data = await getProyectos();
      setProyectos(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProyecto && currentProyecto.id) {
        await updateProyecto(currentProyecto.id, formData);
      } else {
        await createProyecto(formData);
      }
      fetchProyectos();
      closeModal();
    } catch (err) {
      setError('Error al guardar el proyecto');
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setCurrentProyecto(null);
    setFormData({
      codigo: '',
      nombre: '',
      descripcion: '',
      estado: 'PLANIFICADO',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin_estimada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsable: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proyecto: IProyecto) => {
    setCurrentProyecto(proyecto);
    setFormData({
      codigo: proyecto.codigo,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      estado: proyecto.estado,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin_estimada: proyecto.fecha_fin_estimada,
      fecha_fin_real: proyecto.fecha_fin_real,
      responsable: proyecto.responsable,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmDelete = (id: number) => {
    setProyectoToDelete(id);
    setShowDeleteAlert(true);
  };

  const handleDelete = async () => {
    if (proyectoToDelete) {
      try {
        await deleteProyecto(proyectoToDelete);
        fetchProyectos();
      } catch (err) {
        setError('Error al eliminar el proyecto');
        console.error(err);
      } finally {
        setShowDeleteAlert(false);
        setProyectoToDelete(null);
      }
    }
  };

  const handleStatusChange = async (id: number, newStatus: IProyecto['estado']) => {
    try {
      await changeProjectStatus(id, newStatus);
      fetchProyectos();
    } catch (err) {
      setError('Error al cambiar el estado del proyecto');
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PLANIFICADO': return 'bg-blue-100 text-blue-800';
      case 'EN_PROGRESO': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
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
                Administración de Proyectos
              </h1>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
              >
                Nuevo Proyecto
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin Estimada</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsable</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {proyectos.map((proyecto) => (
                      <tr key={proyecto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{proyecto.codigo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{proyecto.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proyecto.estado)}`}>
                            {proyecto.estado_display || proyecto.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{proyecto.fecha_inicio}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{proyecto.fecha_fin_estimada}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {proyecto.responsable_detail?.first_name} {proyecto.responsable_detail?.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => openEditModal(proyecto)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => confirmDelete(proyecto.id!)}
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
      
      {/* Modal de Proyecto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentProyecto ? 'Editar Proyecto' : 'Nuevo Proyecto'}
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
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="estado">
                      Estado *
                    </label>
                    <select
                      id="estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="PLANIFICADO">Planificado</option>
                      <option value="EN_PROGRESO">En progreso</option>
                      <option value="COMPLETADO">Completado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_inicio">
                      Fecha Inicio *
                    </label>
                    <input
                      type="date"
                      id="fecha_inicio"
                      name="fecha_inicio"
                      value={formData.fecha_inicio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_fin_estimada">
                      Fecha Fin Estimada *
                    </label>
                    <input
                      type="date"
                      id="fecha_fin_estimada"
                      name="fecha_fin_estimada"
                      value={formData.fecha_fin_estimada}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  {formData.estado === 'COMPLETADO' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fecha_fin_real">
                        Fecha Fin Real
                      </label>
                      <input
                        type="date"
                        id="fecha_fin_real"
                        name="fecha_fin_real"
                        value={formData.fecha_fin_real || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="responsable">
                      Responsable *
                    </label>
                    <input
                      type="number"
                      id="responsable"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
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
                    {currentProyecto ? 'Actualizar' : 'Crear'}
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
            <p className="mb-6">¿Estás seguro que deseas eliminar este proyecto? Esta acción no se puede deshacer.</p>
            
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

export default ProjectsPage;