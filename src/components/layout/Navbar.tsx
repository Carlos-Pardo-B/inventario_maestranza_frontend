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
                <Link to='/' className="hover:text-blue-400 transition-colors">Home</Link>
                <Link to='/product_list' className="hover:text-blue-400 transition-colors">Productos</Link>
                <Link to='/' className="hover:text-blue-400 transition-colors">Contacto</Link>
                <Link to='/' className="hover:text-blue-400 transition-colors">Acerca</Link>
            </div>
            
            {/* Botones derecha */}
            <div className="flex justify-end gap-4 px-10">
                <Button
                    text="Registrarse"
                    onClick={() => navigate('/login')}
                    color="blue"
                    size="md"
                />
                <Button
                    text="Ingresar"
                    onClick={() => console.log('Clicked')}
                    color="green"
                    size="md"
                />
            </div>
        </nav>
    );
};

export default Navbar;