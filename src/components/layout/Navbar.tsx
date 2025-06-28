import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="fixed w-full h-16 z-50 bg-black/30 backdrop-blur-md grid grid-cols-3 items-center gap-4">
            {/* Contenido izquierdo */}
            <div className="text-white font-bold text-2xl px-8">
                <p>Maestranzas Unidas S.A.</p>
            </div>

            {/* Links centrales */}
            <div className="flex justify-center gap-10 text-white font-bold text-xl">
                <Link to='/' className="hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-white/10">
                    Inicio
                </Link>
                <Link to='/' className="hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-white/10">
                    Servicios
                </Link>
                <Link to='/' className="hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-white/10">
                    Proyectos
                </Link>
                <Link to='/' className="hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-white/10">
                    Clientes
                </Link>
                <Link to='/' className="hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-white/10">
                    Contacto
                </Link>
                <Link to='/' className="hover:text-blue-400 transition-colors px-3 py-1 rounded hover:bg-white/10">
                    Nosotros
                </Link>
            </div>

            {/* Botones derecha */}
            <div className="flex justify-end gap-4 px-10">
                <Button
                    text="Ingresar"
                    onClick={() => navigate('/login')}
                    color="green"
                    size="md"
                />
            </div>
        </nav>
    );
};

export default Navbar;