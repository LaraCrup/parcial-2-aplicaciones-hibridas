import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MainH1 from '../components/MainH1';

function RecetaDetail() {
    const { id } = useParams();
    const [plato, setPlato] = useState(null);
    const [ingredientes, setIngredientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlatoAndIngredients = async () => {
            try {
                const platoRes = await fetch(`http://localhost:3000/api/platos/${id}`);
                const platoData = await platoRes.json();

                if (!platoData.data) {
                    setError('Plato no encontrado');
                    setLoading(false);
                    return;
                }

                setPlato(platoData.data);

                // Buscar ingredientes por nombre
                const ingredientesPromises = platoData.data.ingredientes.map(nombre =>
                    fetch(`http://localhost:3000/api/ingredientes/nombre/${encodeURIComponent(nombre)}`)
                        .then(res => res.json())
                        .then(data => {
                            // Puede devolver un array, tomar el primero si existe
                            if (data.data && data.data.length > 0) {
                                return data.data[0];
                            }
                            return null;
                        })
                );
                const ingredientesData = await Promise.all(ingredientesPromises);
                setIngredientes(ingredientesData.filter(Boolean));
                setLoading(false);
            } catch (err) {
                setError('Error al cargar los datos');
                setLoading(false);
            }
        };

        fetchPlatoAndIngredients();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!plato) return <div>Plato no encontrado</div>;

    return (
        <>
            <MainH1>{plato.nombre}</MainH1>
            <div className='recetaDetail'>
                {plato.imagen && plato.imagen.startsWith('uploads/') && (
                    <img src={`http://localhost:3000/${plato.imagen}`} alt={plato.nombre} />
                )}
                <div>
                    <div className="recetaInfo">
                        <p>{plato.descripcion}</p>
                        <div>
                            <div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m-1-2.05V18q-.825 0-1.412-.587T9 16v-1l-4.8-4.8q-.075.45-.137.9T4 12q0 3.025 1.988 5.3T11 19.95m6.9-2.55q1.025-1.125 1.563-2.512T20 12q0-2.45-1.362-4.475T15 4.6V5q0 .825-.587 1.413T13 7h-2v2q0 .425-.288.713T10 10H8v2h6q.425 0 .713.288T15 13v3h1q.65 0 1.175.388T17.9 17.4"/></svg></span>
                                <p>Región: {plato.region}</p>
                            </div>
                            <div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9 8.85V12q0 .425.288.713T10 13t.713-.288T11 12V8.85l.9.875q.275.275.688.275t.712-.3q.275-.275.275-.7t-.275-.7l-2.575-2.575q-.3-.3-.712-.3t-.713.3L6.7 8.3q-.275.275-.288.688T6.7 9.7q.275.275.688.288t.712-.263zm4 6.3l-.9-.875Q11.825 14 11.413 14t-.713.3q-.275.275-.275.7t.275.7l2.6 2.6q.3.3.713.3t.712-.3l2.575-2.6q.275-.275.288-.687T17.3 14.3q-.275-.275-.687-.288t-.713.263l-.9.875V12q0-.425-.288-.712T14 11t-.712.288T13 12zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8"/></svg></span>
                                <p>Tipo: {plato.tipo}</p>
                            </div>
                            <div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M2.7 17.625q-.3-.3-.288-.712t.288-.688l5.275-5.35Q8.55 10.3 9.4 10.3t1.425.575l2.575 2.6l5.2-5.15H17q-.425 0-.712-.288T16 7.326t.288-.712t.712-.288h4q.425 0 .713.288t.287.712v4q0 .425-.288.713t-.712.287t-.712-.287t-.288-.713v-1.6L14.825 14.9q-.575.575-1.425.575t-1.425-.575L9.4 12.325l-5.3 5.3q-.275.275-.7.275t-.7-.275"/></svg></span>
                                <p>Dificultad: {plato.dificultad}</p>
                            </div>
                            <div>
                                <span><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="m13 12.175l2.25 2.25q.275.275.275.688t-.275.712q-.3.3-.712.3t-.713-.3L11.3 13.3q-.15-.15-.225-.337T11 12.575V9q0-.425.288-.712T12 8t.713.288T13 9zM12 6q-.425 0-.712-.288T11 5V4h2v1q0 .425-.288.713T12 6m6 6q0-.425.288-.712T19 11h1v2h-1q-.425 0-.712-.288T18 12m-6 6q.425 0 .713.288T13 19v1h-2v-1q0-.425.288-.712T12 18m-6-6q0 .425-.288.713T5 13H4v-2h1q.425 0 .713.288T6 12m6 10q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m8-10q0-3.35-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20t5.675-2.325T20 12m-8 0"/></svg></span>
                                <p>Tiempo de cocción: {plato.tiempoCoccion} minutos</p>
                            </div>
                        </div>
                    </div>
                    <div className="ingredientesContainer">
                        <h2>Ingredientes:</h2>
                        <div className="ingredientesList">
                            {ingredientes.filter(ingrediente => ingrediente.habilitado !== false).map(ingrediente => (
                                <div key={ingrediente._id}>
                                    <h3>{ingrediente.nombre}</h3>
                                    <p>Tipo: {ingrediente.tipo}</p>
                                    {ingrediente.alergeno && (
                                        <p className="alergeno-warning">⚠️ Este ingrediente es alérgeno</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default RecetaDetail;
