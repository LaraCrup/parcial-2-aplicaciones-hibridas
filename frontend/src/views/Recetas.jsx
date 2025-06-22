import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MainH1 from '../components/MainH1';
import { Alert } from '../components/Alert';


function Recetas() {
    const host = 'http://localhost:3000/api'
    const [recetas, setRecetas] = useState([]);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [recetaToDelete, setRecetaToDelete] = useState(null);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const navigate = useNavigate();

    async function getRecetas() {
        try {
            const response = await fetch(`${host}/platos`);
            if (!response.ok) {
                alert('Error al obtener las recetas');
                return
            }
            const { data } = await response.json();
            setRecetas(data);

        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        getRecetas();
    }, []);

    async function deletePlato(id) {
        const token = localStorage.getItem('token');
        const opciones = {
            method: 'DELETE',
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };

        try {
            const response = await fetch(`${host}/platos/${id}`, opciones);

            if (!response.ok) {
                setMsg({ text: 'Error al eliminar la receta', type: 'error' });
                setShowDeleteAlert(true);
                return;
            }
            const data = await response.json();
            getRecetas();
            setShowDeleteAlert(false);
            setRecetaToDelete(null);
        } catch (error) {
            setMsg({ text: 'Error de red o servidor', type: 'error' });
            setShowDeleteAlert(true);
        }

    }

    function handleDeleteClick(id) {
        setRecetaToDelete(id);
        setShowDeleteAlert(true);
    }

    return (
        <>
            <MainH1>ABM de Recetas</MainH1>
            <button
                type='button'
                className="primaryButton"
                onClick={() => {navigate('/recetanew')}}
            >
                Nueva Receta
            </button>
            <table className="usersTable">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Region</th>
                        <th>Tipo</th>
                        <th>Ingredientes</th>
                        <th>Tiempo de Coccion</th>
                        <th>Dificultad</th>
                        <th>Imagen</th>
                        <th colSpan={2}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {recetas.map(receta => (
                        <tr key={receta._id}>
                            <td>{receta.nombre}</td>
                            <td>{receta.descripcion}</td>
                            <td>{receta.region}</td>
                            <td className='capitalized'>{receta.tipo}</td>
                            <td>
                                {Array.isArray(receta.ingredientes)
                                    ? receta.ingredientes.join(', ')
                                    : receta.ingredientes}
                            </td>
                            <td>{receta.tiempoCoccion}</td>
                            <td className='capitalized'>{receta.dificultad}</td>
                            <td>
                                {receta.imagen && receta.imagen.startsWith('uploads/') && (
                                    <img 
                                        src={`http://localhost:3000/${receta.imagen}`} 
                                        alt={receta.nombre} 
                                        style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover' }} 
                                    />
                                )}
                            </td>
                            <td>
                                <button
                                    type='button'
                                    className="userEditBtn"
                                    onClick={() => {navigate(`/recetaupdate/${receta._id}`)}}
                                >
                                    E
                                </button>
                            </td>
                            <td>
                                <button
                                    type='button'
                                    className="userDeleteBtn"
                                    onClick={() => handleDeleteClick(receta._id)}
                                >
                                    D
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Alert 
                text={msg.text || "¿Está seguro que desea eliminar esta receta?"} 
                isVisible={showDeleteAlert}
                onClose={() => {
                    setShowDeleteAlert(false);
                    setRecetaToDelete(null);
                    setMsg({ text: '', type: '' });
                }}
                actions={msg.text ? [
                    {
                        text: "Cerrar",
                        onClick: () => {
                            setShowDeleteAlert(false);
                            setRecetaToDelete(null);
                            setMsg({ text: '', type: '' });
                        }
                    }
                ] : [
                    {
                        text: "Sí",
                        onClick: () => deletePlato(recetaToDelete)
                    },
                    {
                        text: "No",
                        onClick: () => {
                            setShowDeleteAlert(false);
                            setRecetaToDelete(null);
                        }
                    }
                ]}
            />
        </>
    );
}

export default Recetas;