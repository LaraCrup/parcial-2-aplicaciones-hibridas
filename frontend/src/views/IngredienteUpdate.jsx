import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Alert } from '../components/Alert';
import MainH1 from '../components/MainH1';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormCheckbox from '../components/FormCheckbox';

function IngredienteUpdate() {
    const host = 'http://localhost:3000/api'
    const [ingrediente, setIngrediente] = useState({
        nombre: '',
        descripcion: '',
        tipo: '',
        alergeno: false,
        habilitado: true
    });
    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: '',
        tipo: '',
        alergeno: '',
        habilitado: ''
    });
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [showAlert, setShowAlert] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    function validateField(name, value) {
        switch (name) {
            case 'nombre':
                if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
                if (value.trim().length > 32) return 'El nombre no puede superar los 32 caracteres';
                return '';
            case 'descripcion':
                if (value.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres';
                return '';
            case 'tipo':
                if (!['vegetal', 'carne', 'lácteo', 'cereal', 'condimento', 'otro'].includes(value)) return 'Debes seleccionar un tipo válido';
                return '';
            case 'alergeno':
                if (typeof value !== 'boolean') return 'El valor debe ser verdadero o falso';
                return '';
            case 'habilitado':
                if (typeof value !== 'boolean') return 'El valor debe ser verdadero o falso';
                return '';
            default:
                return '';
        }
    }

    useEffect(() => {
        async function getIngredienteById() {
            try {
                const response = await fetch(`${host}/ingredientes/${id}`);
                if (!response.ok) {
                    setMsg({ text: 'Error al obtener el ingrediente', type: 'error' });
                    setShowAlert(true);
                    return;
                }
                const { data } = await response.json();
                setIngrediente({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || '',
                    tipo: data.tipo || '',
                    alergeno: data.alergeno || false,
                    habilitado: data.habilitado !== undefined ? data.habilitado : true
                });
            } catch (error) {
                setMsg({ text: 'Error de red o servidor', type: 'error' });
                setShowAlert(true);
            }
        }
        getIngredienteById();
    }, [id]);

    function handlerChange(e) {
        const { name, value, type, checked } = e.target;
        let newValue = value;
        if (type === 'checkbox') {
            newValue = checked;
        }
        setIngrediente(prev => ({
            ...prev,
            [name]: newValue
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, newValue)
        }));
        setMsg({ text: '', type: '' });
    }

    async function putIngrediente(e) {
        e.preventDefault();
        const formErrors = Object.keys(ingrediente).reduce((acc, key) => {
            const error = validateField(key, ingrediente[key]);
            return { ...acc, [key]: error };
        }, {});
        setErrors(formErrors);

        if (!Object.values(formErrors).every(error => !error)) {
            setMsg({ text: 'Por favor corrige los errores antes de continuar.', type: 'error' });
            setShowAlert(true);
            return;
        }

        const token = localStorage.getItem('token');
        const opciones = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: JSON.stringify(ingrediente)
        };

        try {
            const response = await fetch(`${host}/ingredientes/${id}`, opciones);

            if (!response.ok) {
                const d = await response.json();
                const { msg: errorMsg } = d;
                setMsg({ text: errorMsg || 'Error al guardar el ingrediente', type: 'error' });
                setShowAlert(true);
                return;
            }

            setMsg({ text: 'Ingrediente actualizado exitosamente', type: 'success' });
            setShowAlert(true);
            setTimeout(() => {
                navigate('/ingredientes');
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
            <MainH1>Actualizar Ingrediente</MainH1>
            <form onSubmit={putIngrediente} className='longForm'>
                <FormInput
                    label="Nombre"
                    htmlFor="nombre"
                    type="text"
                    name="nombre"
                    value={ingrediente.nombre}
                    onChange={handlerChange}
                    required
                    error={errors.nombre}
                />
                <FormInput
                    label="Descripción"
                    htmlFor="descripcion"
                    type="text"
                    name="descripcion"
                    value={ingrediente.descripcion}
                    onChange={handlerChange}
                    required
                    error={errors.descripcion}
                />
                <FormSelect
                    label="Tipo"
                    htmlFor="tipo"
                    name="tipo"
                    value={ingrediente.tipo}
                    onChange={handlerChange}
                    required
                    error={errors.tipo}
                    options={[
                        { value: 'vegetal', label: 'Vegetal' },
                        { value: 'carne', label: 'Carne' },
                        { value: 'lácteo', label: 'Lácteo' },
                        { value: 'cereal', label: 'Cereal' },
                        { value: 'condimento', label: 'Condimento' },
                        { value: 'otro', label: 'Otro' }
                    ]}
                />
                <FormCheckbox
                    label="¿Es alérgeno?"
                    name="alergeno"
                    checked={ingrediente.alergeno}
                    onChange={handlerChange}
                    error={errors.alergeno}
                />
                <FormCheckbox
                    label="¿Está habilitado?"
                    name="habilitado"
                    checked={ingrediente.habilitado}
                    onChange={handlerChange}
                    error={errors.habilitado}
                />
                <button type='submit' className='primaryButton'>Guardar</button>
            </form>
        </>
    );
}

export default IngredienteUpdate;