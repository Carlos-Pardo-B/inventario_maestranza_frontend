import { useEffect } from 'react';
import headerImg from '../assets/images/home/maestranza-detalle.jpg';

const Home = () => {
  // Deshabilitar scroll al montar el componente
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden"> {/* Cambiado a fixed y overflow-hidden */}
      {/* Imagen de fondo con opacidad ajustable */}
      <img 
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        src={headerImg} 
        alt="Maestranza industrial" 
      />
      
      {/* Capa de overlay para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Contenido de texto centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Bienvenido a Maestranzas Unidas S.A.
        </h1>
        <p className="text-white text-xl md:text-2xl max-w-2xl drop-shadow-md">
          Soluciones industriales de alta calidad con más de 20 años de experiencia
        </p>
        
        {/* Botón de acción */}
        <button 
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          onClick={() => {
            // Habilitar scroll antes de navegar si es necesario
            document.body.style.overflow = 'auto';
            // Aquí iría la navegación si el botón lleva a otra página
          }}
        >
          Conoce nuestros servicios
        </button>
      </div>
    </div>
  );
};

export default Home;