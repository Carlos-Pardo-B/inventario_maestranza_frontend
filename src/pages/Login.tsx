import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AlmacenImg from '../assets/images/home/almacen.webp';
import authService from '../api/auth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Deshabilitar scroll al montar el componente
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login(username, password);
      navigate('/administrator');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.detail || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen */}
      <img 
        src={AlmacenImg} 
        alt="Almacén industrial" 
        className="fixed inset-0 w-full h-full object-cover brightness-50"
      />
      
      {/* Overlay para mejor contraste */}
      <div className="fixed inset-0 bg-black/30"></div>
      
      {/* Contenedor del formulario */}
      <div className="relative z-10 w-full max-w-md px-6 py-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl mx-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Iniciar sesión
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
              autoFocus
            />
          </div>
          
          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>
          
          {/* Enlace "Olvidé contraseña" */}
          <div className="flex justify-end">
            <Link 
              to="/recuperar-contrasena" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          {/* Botón de submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Iniciando sesión...' : 'Ingresar'}
          </button>
        </form>
        
        {/* Enlace a registro */}
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">¿No tienes cuenta? </span>
          <Link 
            to="/registro" 
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

// Componentes de iconos
const EyeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

export default Login;