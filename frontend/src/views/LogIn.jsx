import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import MainH1 from '../components/MainH1';
import FormInput from '../components/FormInput';

function LogIn() {
    const host = 'http://localhost:3000/api'
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    function validateField(name, value) {
        switch (name) {
            case 'email':
                const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailRegex.test(value)) return 'Email inválido. Debe tener un formato válido (ejemplo@dominio.com)';
                return '';
            case 'password':
                if (value.length < 4) return 'La contraseña debe tener al menos 4 caracteres';
                return '';
            default:
                return '';
        }
    }

    function handlerChange(e) {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    }

    function handlerForm(e) {
        e.preventDefault();
        const formErrors = Object.keys(user).reduce((acc, key) => {
            const error = validateField(key, user[key]);
            return { ...acc, [key]: error };
        }, {});

        setErrors(formErrors);

        if (Object.values(formErrors).every(error => !error)) {
            loginUser();
        }
    }

    async function loginUser() {
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        try {
            const response = await fetch(`${host}/users/auth`, opciones);
            const data = await response.json();
            
            if (!response.ok) {
                switch (response.status) {
                    case 404:
                        throw new Error(data.msg || 'Credenciales inválidas');
                    case 400:
                        throw new Error(data.msg || 'Datos de inicio de sesión inválidos');
                    case 500:
                        throw new Error('Error en el servidor. Por favor, intente más tarde');
                    default:
                        throw new Error(data.msg || 'Error desconocido');
                }
            }
            
            if (data.token && data.user) {
                login(data.user, data.token);
                setAlertMessage('Inicio de sesión exitoso');
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/users');
                }, 1500);
            } else {
                setAlertMessage('Error: No se recibió el token o los datos de usuario');
                setShowAlert(true);
            }

        } catch (error) {
            console.error('Error:', error);
            setAlertMessage(error.message);
            setShowAlert(true);
        }
    }


    return (
        <>
            <Alert 
                text={alertMessage}
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <MainH1>Iniciar Sesion</MainH1>
            <form onSubmit={handlerForm} className='shortForm'>
                <FormInput
                    label="Email"
                    htmlFor="email"
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handlerChange}
                    required
                    error={errors.email}
                />
                <FormInput
                    label="Contraseña"
                    htmlFor="password"
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handlerChange}
                    required
                    error={errors.password}
                />
                <button type='submit' className='primaryButton'>Enviar</button>
            </form>
        </>
    );
}

export default LogIn;