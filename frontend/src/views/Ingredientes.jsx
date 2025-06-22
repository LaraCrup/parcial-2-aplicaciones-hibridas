import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import MainH1 from '../components/MainH1';


function Ingredientes() {
    const host = 'http://localhost:3000/api'
    const [ingredientes, setIngredientes] = useState([]);

    const navigate = useNavigate();

    async function getIngredientes() {
        try {
            const response = await fetch(`${host}/ingredientes/all`);
            if (!response.ok) {
                alert('Error al obtener los ingredientes');
                return
            }
            const { data } = await response.json();
            setIngredientes(data);

        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        getIngredientes();
    }, []);


    return (
        <>
            <MainH1>ABM de Ingredientes</MainH1>
            <button
                type='button'
                className="primaryButton"
                onClick={() => {navigate('/ingredientenew')}}
            >
                Nuevo Ingrediente
            </button>
            <table className="usersTable">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Tipo</th>
                        <th>Alérgeno</th>
                        <th>Estado</th>
                        <th colSpan={1}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ingredientes.map(ingrediente => (
                        <tr key={ingrediente._id}>
                            <td className='capitalized'>{ingrediente.nombre}</td>
                            <td>{ingrediente.descripcion}</td>
                            <td className='capitalized'>{ingrediente.tipo}</td>
                            <td>{ingrediente.alergeno ? 'Sí' : 'No'}</td>
                            <td>{ingrediente.habilitado ? 'Habilitado' : 'Deshabilitado'}</td>
                            <td>
                                <button
                                    type='button'
                                    className="userEditBtn"
                                    onClick={() => {navigate(`/ingredienteupdate/${ingrediente._id}`)}}
                                >
                                    E
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default Ingredientes;