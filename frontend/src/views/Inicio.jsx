import { useState, useEffect } from 'react'
import MainH1 from '../components/MainH1';
import PlatoCard from '../components/PlatoCard';

function Inicio() {
    const [platos, setPlatos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [dificultad, setDificultad] = useState('');
    const [tiempoCoccion, setTiempoCoccion] = useState('');

    const fetchPlatos = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.data) {
                setPlatos(data.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPlatos('http://localhost:3000/api/platos');
    }, []);

    const handleFilter = (filterType) => {
        let url = 'http://localhost:3000/api/platos';
        
        switch(filterType) {
            case 'nombre':
                if (nombre) url = `${url}/nombre/${nombre}`;
                break;
            case 'tipo':
                if (tipo) url = `${url}/tipo/${tipo}`;
                break;
            case 'dificultad':
                if (dificultad) url = `${url}/dificultad/${dificultad}`;
                break;
            case 'tiempo':
                if (tiempoCoccion) url = `${url}/tiempo/${tiempoCoccion}`;
                break;
            default:
                break;
        }
        
        fetchPlatos(url);
    };

    const clearFilters = () => {
        setNombre('');
        setTipo('');
        setDificultad('');
        setTiempoCoccion('');
        fetchPlatos('http://localhost:3000/api/platos');
    };

    const handleNombreChange = (e) => {
        const value = e.target.value;
        setNombre(value);
        setTipo('');
        setDificultad('');
        setTiempoCoccion('');
        if (value) {
            fetchPlatos(`http://localhost:3000/api/platos/nombre/${value}`);
        } else {
            fetchPlatos('http://localhost:3000/api/platos');
        }
    };

    const handleTipoChange = (e) => {
        const value = e.target.value;
        setTipo(value);
        setNombre('');
        setDificultad('');
        setTiempoCoccion('');
        if (value) {
            fetchPlatos(`http://localhost:3000/api/platos/tipo/${value}`);
        } else {
            fetchPlatos('http://localhost:3000/api/platos');
        }
    };

    const handleDificultadChange = (e) => {
        const value = e.target.value;
        setDificultad(value);
        setNombre('');
        setTipo('');
        setTiempoCoccion('');
        if (value) {
            fetchPlatos(`http://localhost:3000/api/platos/dificultad/${value}`);
        } else {
            fetchPlatos('http://localhost:3000/api/platos');
        }
    };

    const handleTiempoChange = (e) => {
        const value = e.target.value;
        setTiempoCoccion(value);
        setNombre('');
        setTipo('');
        setDificultad('');
        if (value) {
            fetchPlatos(`http://localhost:3000/api/platos/tiempo/${value}`);
        } else {
            fetchPlatos('http://localhost:3000/api/platos');
        }
    };

    return (
        <>
            <MainH1>Recetas</MainH1>
            <div className='filterControls'>
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    value={nombre}
                    onChange={handleNombreChange}
                    disabled={tipo || dificultad || tiempoCoccion}
                    className={tipo || dificultad || tiempoCoccion ? 'filterDisabled' : ''}
                />
                <select
                    value={tipo}
                    onChange={handleTipoChange}
                    disabled={nombre || dificultad || tiempoCoccion}
                    className={nombre || dificultad || tiempoCoccion ? 'filterDisabled' : ''}
                >
                    <option value="">Filtrar por tipo</option>
                    <option value="dulce">Dulce</option>
                    <option value="salado">Salado</option>
                </select>
                <select
                    value={dificultad}
                    onChange={handleDificultadChange}
                    disabled={nombre || tipo || tiempoCoccion}
                    className={nombre || tipo || tiempoCoccion ? 'filterDisabled' : ''}
                >
                    <option value="">Filtrar por dificultad</option>
                    <option value="fácil">Fácil</option>
                    <option value="media">Media</option>
                    <option value="difícil">Difícil</option>
                </select>
                <input
                    type="number"
                    placeholder="Tiempo máximo (min)"
                    value={tiempoCoccion}
                    onChange={handleTiempoChange}
                    disabled={nombre || tipo || dificultad}
                    className={nombre || tipo || dificultad ? 'filterDisabled' : ''}
                />
                <button onClick={clearFilters} className='primaryButton'>Limpiar filtros</button>
            </div>
            <div className='platoGrid'>
                {platos.map(plato => (
                    <PlatoCard key={plato._id} plato={plato} />
                ))}
            </div>
        </>
    );
}

export default Inicio;