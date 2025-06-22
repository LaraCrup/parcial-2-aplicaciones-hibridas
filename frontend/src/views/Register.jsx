import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import MainH1 from '../components/MainH1';
import FormInput from '../components/FormInput';

function Register() {
    const host = 'http://localhost:3000/api'
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    function validateField(name, value) {
        switch (name) {
            case 'name':
                if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
                if (value.length > 16) return 'El nombre no puede superar los 16 caracteres';
                return '';
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
            registerUser();
        }
    }

    async function registerUser() {
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        try {
            const response = await fetch(`${host}/users`, opciones);
            const data = await response.json();
            
            if (!response.ok) {
                switch (response.status) {
                    case 409:
                        throw new Error(data.msg || 'El email ya está registrado');
                    case 400:
                        throw new Error(data.msg || 'Error de validación en los datos');
                    case 500:
                        throw new Error('Error en el servidor. Por favor, intente más tarde');
                    default:
                        throw new Error(data.msg || 'Error desconocido');
                }
            }
            
            if (data.token) {
                const userData = {
                    id: data.id,
                    email: user.email,
                    name: user.name
                };
                login(userData, data.token);
                setAlertMessage('Registro exitoso');
                setShowAlert(true);
                setTimeout(() => {
                    navigate('/users');
                }, 1500);
            } else {
                setAlertMessage('Error: No se recibió el token');
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
            <MainH1>Registro</MainH1>
            <form onSubmit={handlerForm} className='shortForm'>
                <FormInput
                    label="Nombre"
                    htmlFor="name"
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handlerChange}
                    required
                    error={errors.name}
                />
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
                <button type='submit' className='primaryButton'>Registrarse</button>
            </form>
        </>
    );
}

export default Register;