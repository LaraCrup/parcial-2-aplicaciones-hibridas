import { NavLink } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';
import { useContext, useState } from 'react';
import { Alert } from '../components/Alert';


function Nav() {
    const { logout, isAuthenticated } = useContext(AuthContext);
    const [showAlert, setShowAlert] = useState(false);

    const handleLogout = () => {
        logout();
        setShowAlert(true);
    };

    return (
        <>
            <Alert
                text="Has cerrado sesión exitosamente"
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <nav>
                <ul>
                            <li><NavLink to="/">Inicio</NavLink></li>
                    {!isAuthenticated && (
                        <>
                            <li><NavLink to="/login">Log In</NavLink></li>
                            <li><NavLink to="/register">Registrarse</NavLink></li>
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <li><NavLink to="/users">Usuarios</NavLink></li>
                            <li><NavLink to="/recetas">Recetas</NavLink></li>
                            <li><NavLink to="/ingredientes">Ingredientes</NavLink></li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </nav>
        </>
    )
}

export default Nav;