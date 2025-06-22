import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import MainH1 from '../components/MainH1';
import { Alert } from '../components/Alert';


function Users() {
    const host = 'http://localhost:3000/api'
    const [users, setUsers] = useState([]);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const navigate = useNavigate();

    async function getUsers() {
        try {
            const response = await fetch(`${host}/users`);
            if (!response.ok) {
                alert('Error al obtener los usuarios');
                return
            }
            const { data } = await response.json();
            setUsers(data);

        } catch (error) {
            console.error(error);
        }

    }

    useEffect(() => {
        getUsers();
    }, []);

    async function deleteUser(id) {
        const opciones = {
            method: 'DELETE',
        };

        try {
            const response = await fetch(`${host}/users/${id}`, opciones);

            if (!response.ok) {
                alert('Error al eliminar el usuario');
                return
            }
            const data = await response.json();
            getUsers();
            setShowDeleteAlert(false);
            setUserToDelete(null);
        } catch (error) {
            console.error(error);
        }

    }

    function handleDeleteClick(id) {
        setUserToDelete(id);
        setShowDeleteAlert(true);
    }

    return (
        <>
            <MainH1>ABM de Usuarios</MainH1>
            <button
                type='button'
                className="primaryButton"
                onClick={() => {navigate('/usernew')}}
            >
                Nuevo Usuario
            </button>
            <table className="usersTable">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th colSpan={2}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button
                                    type='button'
                                    className="userEditBtn"
                                    onClick={() => {navigate(`/userupdate/${user._id}`)}}
                                >
                                    E
                                </button>
                            </td>
                            <td>
                                <button
                                    type='button'
                                    className="userDeleteBtn"
                                    onClick={() => handleDeleteClick(user._id)}
                                >
                                    D
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Alert 
                text="¿Está seguro que desea eliminar este usuario?" 
                isVisible={showDeleteAlert}
                onClose={() => {
                    setShowDeleteAlert(false);
                    setUserToDelete(null);
                }}
                actions={[
                    {
                        text: "Sí",
                        onClick: () => deleteUser(userToDelete)
                    },
                    {
                        text: "No",
                        onClick: () => {
                            setShowDeleteAlert(false);
                            setUserToDelete(null);
                        }
                    }
                ]}
            />
        </>
    );
}

export default Users;