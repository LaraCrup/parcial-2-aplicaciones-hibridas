import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import MainH1 from '../components/MainH1';
import FormInput from '../components/FormInput';

function UserNew() {
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
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    function validateField(name, value) {
        switch (name) {
            case 'name':
                if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
                if (value.trim().length > 16) return 'El nombre no puede superar los 16 caracteres';
                return '';
            case 'email':
                const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
                if (!emailRegex.test(value.trim())) return 'Email inválido. Debe tener un formato válido (ejemplo@dominio.com)';
                return '';
            case 'password':
                if (value.trim().length < 4) return 'La contraseña debe tener al menos 4 caracteres';
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
        setMsg({ text: '', type: '' });
    }

    async function postUser(e) {
        e.preventDefault();
        const formErrors = Object.keys(user).reduce((acc, key) => {
            const error = validateField(key, user[key]);
            return { ...acc, [key]: error };
        }, {});
        setErrors(formErrors);

        if (!Object.values(formErrors).every(error => !error)) {
            setMsg({ text: 'Por favor corrige los errores antes de continuar.', type: 'error' });
            setShowAlert(true);
            return;
        }

        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        };

        try {
            const response = await fetch(`${host}/users`, opciones);

            if (!response.ok) {
                const d = await response.json();
                const { msg: errorMsg } = d;
                setMsg({ text: errorMsg || 'Error al guardar el usuario', type: 'error' });
                setShowAlert(true);
                return;
            }

            setUser({ name: '', email: '', password: '' });
            setMsg({ text: 'Usuario creado exitosamente', type: 'success' });
            setShowAlert(true);
            setTimeout(() => {
                navigate('/users');
            }, 1200);
        } catch (error) {
            setMsg({ text: 'Error de red o servidor', type: 'error' });
            setShowAlert(true);
        }
    }

    return (
        <>
            <Alert 
                text={msg.text}
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
            />
            <MainH1>Crear Usuario</MainH1>
            <form onSubmit={postUser} className='shortForm'>
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
                <button type='submit' className='primaryButton'>Guardar</button>
            </form>
        </>
    );
}

export default UserNew;