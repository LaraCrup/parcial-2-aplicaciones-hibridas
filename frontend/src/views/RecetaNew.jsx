import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/Alert';
import MainH1 from '../components/MainH1';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormCheckbox from '../components/FormCheckbox';

function RecetaNew() {
    const host = 'http://localhost:3000/api'
    const [receta, setReceta] = useState({
        nombre: '',
        descripcion: '',
        region: '',
        tipo: '',
        ingredientes: [],
        tiempoCoccion: '',
        dificultad: '',
        imagen: ''
    });
    const [errors, setErrors] = useState({
        nombre: '',
        descripcion: '',
        region: '',
        tipo: '',
        ingredientes: '',
        tiempoCoccion: '',
        dificultad: '',
        imagen: ''
    });
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [showAlert, setShowAlert] = useState(false);
    const [ingredientesList, setIngredientesList] = useState([]);
    const [imagenFile, setImagenFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/api/ingredientes')
            .then(res => res.json())
            .then(data => {
                if (data && data.data) {
                    const sorted = [...data.data].sort((a, b) => a.nombre.localeCompare(b.nombre));
                    setIngredientesList(sorted);
                }
            })
            .catch(() => setIngredientesList([]));
    }, []);

    function validateField(name, value) {
        switch (name) {
            case 'nombre':
                if (value.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres';
                if (value.trim().length > 32) return 'El nombre no puede superar los 32 caracteres';
                return '';
            case 'descripcion':
                if (value.trim().length < 10) return 'La descripción debe tener al menos 10 caracteres';
                return '';
            case 'region':
                if (value.trim().length < 3) return 'La región debe tener al menos 3 caracteres';
                return '';
            case 'tipo':
                if (!['dulce', 'salado'].includes(value)) return 'Debes seleccionar un tipo';
                return '';
            case 'ingredientes':
                if (!Array.isArray(value) || value.length === 0) return 'Debe seleccionar al menos un ingrediente';
                return '';
            case 'tiempoCoccion':
                if (!/^\d+$/.test(value.trim())) return 'El tiempo de cocción debe ser un número entero positivo';
                if (parseInt(value, 10) <= 0) return 'El tiempo de cocción debe ser mayor a 0';
                return '';
            case 'dificultad':
                if (!['fácil', 'media', 'difícil'].includes(value)) return 'Debes seleccionar una dificultad';
                return '';
            case 'imagen':
                if (!imagenFile) return 'Debe seleccionar una imagen (archivo)';
                return '';
            default:
                return '';
        }
    }

    function handlerChange(e) {
        const { name, value, type, checked, files } = e.target;
        let newValue = value;
        if (name === 'ingredientes' && type === 'checkbox') {
            if (checked) {
                newValue = [...receta.ingredientes, value];
            } else {
                newValue = receta.ingredientes.filter(i => i !== value);
            }
        } else if (name === 'imagen' && type === 'file') {
            setImagenFile(files[0]);
            setReceta(prev => ({
                ...prev,
                imagen: files[0] ? files[0].name : ''
            }));
            setErrors(prev => ({
                ...prev,
                imagen: validateField('imagen', files[0])
            }));
            setMsg({ text: '', type: '' });
            return;
        }
        setReceta(prev => ({
            ...prev,
            [name]: newValue
        }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, newValue)
        }));
        setMsg({ text: '', type: '' });
    }

    async function postReceta(e) {
        e.preventDefault();
        const formErrors = Object.keys(receta).reduce((acc, key) => {
            const error = validateField(key, receta[key]);
            return { ...acc, [key]: error };
        }, {});
        setErrors(formErrors);

        if (!Object.values(formErrors).every(error => !error)) {
            setMsg({ text: 'Por favor corrige los errores antes de continuar.', type: 'error' });
            setShowAlert(true);
            return;
        }

        const formData = new FormData();
        formData.append('nombre', receta.nombre);
        formData.append('descripcion', receta.descripcion);
        formData.append('region', receta.region);
        formData.append('tipo', receta.tipo);
        formData.append('tiempoCoccion', parseInt(receta.tiempoCoccion, 10));
        formData.append('dificultad', receta.dificultad);
        receta.ingredientes.forEach(ing => formData.append('ingredientes[]', ing));
        if (imagenFile) formData.append('imagen', imagenFile);

        const token = localStorage.getItem('token');
        const opciones = {
            method: 'POST',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            body: formData
        };

        try {
            const response = await fetch(`${host}/platos`, opciones);

            if (!response.ok) {
                const d = await response.json();
                const { msg: errorMsg } = d;
                setMsg({ text: errorMsg || 'Error al guardar la receta', type: 'error' });
                setShowAlert(true);
                return;
            }

            setReceta({
                nombre: '',
                descripcion: '',
                region: '',
                tipo: '',
                ingredientes: [],
                tiempoCoccion: '',
                dificultad: '',
                imagen: ''
            });
            setImagenFile(null);
            setMsg({ text: 'Receta creada exitosamente', type: 'success' });
            setShowAlert(true);
            setTimeout(() => {
                navigate('/recetas');
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
            <MainH1>Crear Receta</MainH1>
            <form onSubmit={postReceta} className='longForm' encType="multipart/form-data">
                <FormInput
                    label="Nombre"
                    htmlFor="nombre"
                    type="text"
                    name="nombre"
                    value={receta.nombre}
                    onChange={handlerChange}
                    required
                    error={errors.nombre}
                />
                <FormInput
                    label="Descripción"
                    htmlFor="descripcion"
                    type="text"
                    name="descripcion"
                    value={receta.descripcion}
                    onChange={handlerChange}
                    required
                    error={errors.descripcion}
                />
                <FormInput
                    label="Región"
                    htmlFor="region"
                    type="text"
                    name="region"
                    value={receta.region}
                    onChange={handlerChange}
                    required
                    error={errors.region}
                />
                <FormSelect
                    label="Tipo"
                    htmlFor="tipo"
                    name="tipo"
                    value={receta.tipo}
                    onChange={handlerChange}
                    required
                    error={errors.tipo}
                    options={[
                        { value: 'dulce', label: 'Dulce' },
                        { value: 'salado', label: 'Salado' }
                    ]}
                />
                <FormInput
                    label="Tiempo de cocción (minutos)"
                    htmlFor="tiempoCoccion"
                    type="number"
                    name="tiempoCoccion"
                    value={receta.tiempoCoccion}
                    onChange={handlerChange}
                    required
                    error={errors.tiempoCoccion}
                />
                <FormSelect
                    label="Dificultad"
                    htmlFor="dificultad"
                    name="dificultad"
                    value={receta.dificultad}
                    onChange={handlerChange}
                    required
                    error={errors.dificultad}
                    options={[
                        { value: 'fácil', label: 'Fácil' },
                        { value: 'media', label: 'Media' },
                        { value: 'difícil', label: 'Difícil' }
                    ]}
                />
                <div className="formFieldContainer">
                    <label htmlFor="imagen">Imagen</label>
                    <input
                        type="file"
                        name="imagen"
                        id="imagen"
                        accept="image/*"
                        onChange={handlerChange}
                        required
                    />
                    {errors.imagen && <span className="formError">{errors.imagen}</span>}
                </div>
                <div className="formFieldContainer formIngredientesContainer">
                    <label>Ingredientes</label>
                    <div className='checkboxesContainer'>
                        {ingredientesList.map(ing => (
                            <FormCheckbox
                                key={ing._id}
                                label={ing.nombre}
                                name="ingredientes"
                                value={ing.nombre}
                                checked={receta.ingredientes.includes(ing.nombre)}
                                onChange={handlerChange}
                                error={errors.ingredientes && receta.ingredientes.length === 0 && ingredientesList[0]._id === ing._id ? errors.ingredientes : ''}
                            />
                        ))}
                    </div>
                </div>
                <button type='submit' className='primaryButton'>Guardar</button>
            </form>
        </>
    );
}

export default RecetaNew;