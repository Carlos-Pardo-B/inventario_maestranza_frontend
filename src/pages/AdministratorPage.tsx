import { Link } from 'react-router-dom';
import AlmacenImg from '../assets/images/home/almacen.webp';

// Definición de tipos e interfaces
type UserRole = 'Administrador' | 'Gestor de Inventario' | 'Encargado de Logística' | 
                'Comprador' | 'Jefe de Producción' | 'Gerente de Proyectos' | 'Auditor';

interface Module {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  color: string;
  roles: UserRole[];
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'red' | 'green' | 'purple' | 'yellow';
  trend: 'up' | 'down';
  trendValue: string;
}

const AdministratorPage = () => {
  // Módulos principales agrupados por funcionalidad
  const inventoryModules: Module[] = [
    {
      title: 'Productos',
      description: 'Administra el inventario de productos y componentes',
      path: '/product_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-blue-100 text-blue-600',
      roles: ['Administrador', 'Gestor de Inventario', 'Encargado de Logística']
    },
    {
      title: 'Lotes',
      description: 'Gestiona lotes y fechas de vencimiento de componentes',
      path: '/lot_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'bg-green-100 text-green-600',
      roles: ['Gestor de Inventario', 'Encargado de Logística']
    },
    {
      title: 'Movimientos',
      description: 'Registro de movimientos de inventario',
      path: '/movement_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'bg-indigo-100 text-indigo-600',
      roles: ['Gestor de Inventario', 'Encargado de Logística']
    }
  ];

  const catalogModules: Module[] = [
    {
      title: 'Categorías',
      description: 'Gestiona las categorías de productos',
      path: '/category_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      color: 'bg-purple-100 text-purple-600',
      roles: ['Administrador']
    },
    {
      title: 'Ubicaciones',
      description: 'Administra las ubicaciones físicas en el almacén',
      path: '/location_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-yellow-100 text-yellow-600',
      roles: ['Administrador', 'Encargado de Logística']
    },
    {
      title: 'Etiquetas',
      description: 'Administra las etiquetas para clasificación',
      path: '/tag_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      color: 'bg-red-100 text-red-600',
      roles: ['Administrador']
    }
  ];

  const projectModules: Module[] = [
    {
      title: 'Proyectos',
      description: 'Gestiona los proyectos asociados',
      path: '/project_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'bg-teal-100 text-teal-600',
      roles: ['Jefe de Producción', 'Gerente de Proyectos']
    },
    {
      title: 'Kits',
      description: 'Gestiona kits de componentes para proyectos',
      path: '/kit_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      color: 'bg-orange-100 text-orange-600',
      roles: ['Jefe de Producción', 'Gerente de Proyectos']
    },
    {
      title: 'Componentes de Kits',
      description: 'Administra los componentes que forman los kits',
      path: '/kit_component_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
      color: 'bg-amber-100 text-amber-600',
      roles: ['Jefe de Producción', 'Gerente de Proyectos']
    }
  ];

  const managementModules: Module[] = [
    {
      title: 'Proveedores',
      description: 'Gestiona la información de proveedores',
      path: '/proveedores_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'bg-cyan-100 text-cyan-600',
      roles: ['Comprador', 'Administrador']
    },
    {
      title: 'Usuarios',
      description: 'Administra los usuarios y permisos del sistema',
      path: '/users_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'bg-pink-100 text-pink-600',
      roles: ['Administrador']
    },
    {
      title: 'Alertas',
      description: 'Configura alertas de stock mínimo',
      path: '/alert_list',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'bg-rose-100 text-rose-600',
      roles: ['Administrador', 'Gestor de Inventario']
    }
  ];

  // Simulamos que el usuario actual es Administrador
  const currentUserRole: UserRole = 'Administrador';

  // Filtramos módulos según el rol del usuario
  const filterModulesByRole = (modules: Module[]): Module[] => {
    return modules.filter(module => module.roles.includes(currentUserRole));
  };

  const filteredInventoryModules = filterModulesByRole(inventoryModules);
  const filteredCatalogModules = filterModulesByRole(catalogModules);
  const filteredProjectModules = filterModulesByRole(projectModules);
  const filteredManagementModules = filterModulesByRole(managementModules);

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
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Panel de Control de Inventarios
                </h1>
                <p className="text-gray-600">Bienvenido, {currentUserRole}</p>
              </div>
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
                <span>Ayuda</span>
              </button>
            </div>

            <p className="text-gray-600 mb-10 max-w-2xl">
              Sistema de gestión de inventarios para Maestranzas Unidos S.A. Selecciona el módulo que deseas gestionar.
            </p>

            {/* Sección de Inventario */}
            {filteredInventoryModules.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestión de Inventario</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInventoryModules.map((module, index) => (
                    <ModuleCard key={`inventory-${index}`} module={module} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección de Catálogos */}
            {filteredCatalogModules.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Catálogos del Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCatalogModules.map((module, index) => (
                    <ModuleCard key={`catalog-${index}`} module={module} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección de Proyectos */}
            {filteredProjectModules.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestión de Proyectos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjectModules.map((module, index) => (
                    <ModuleCard key={`project-${index}`} module={module} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección de Administración */}
            {filteredManagementModules.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Administración del Sistema</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredManagementModules.map((module, index) => (
                    <ModuleCard key={`management-${index}`} module={module} />
                  ))}
                </div>
              </div>
            )}

            {/* Sección de estadísticas rápidas */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Resumen del Inventario</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Productos totales" 
                  value="1,248" 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  } 
                  color="blue" 
                  trend="up" 
                  trendValue="5%"
                />
                <StatCard 
                  title="Productos con stock bajo" 
                  value="42" 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  } 
                  color="red" 
                  trend="down" 
                  trendValue="10%"
                />
                <StatCard 
                  title="Movimientos este mes" 
                  value="328" 
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  } 
                  color="green" 
                  trend="up" 
                  trendValue="15%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para tarjetas de módulo
const ModuleCard: React.FC<{ module: Module }> = ({ module }) => (
  <Link
    to={module.path}
    className="group block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
  >
    <div className={`p-6 ${module.color} flex items-center space-x-4`}>
      <div className="p-3 rounded-lg bg-white/30 backdrop-blur-sm">
        {module.icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold">{module.title}</h3>
        <p className="text-sm opacity-80">{module.description}</p>
      </div>
    </div>
    <div className="bg-white p-4 flex justify-between items-center">
      <span className="text-sm text-gray-500">Acceder al módulo</span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    </div>
  </Link>
);

// Componente para tarjetas de estadísticas
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendValue }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600'
  };

  const trendIcons = {
    up: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    )
  };

  return (
    <div className={`p-6 rounded-lg ${colorClasses[color]}`}>
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClasses[color].replace('50', '100')}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <div className="flex items-end space-x-2">
            <p className="text-2xl font-bold">{value}</p>
            <span className={`text-xs flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trendIcons[trend]} {trendValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministratorPage;