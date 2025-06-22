import { useNavigate } from 'react-router-dom';

function PlatoCard({ plato }) {
    const navigate = useNavigate();

    return (
        <div onClick={() => {navigate(`/recetas/${plato._id}`)}} className="platoCard">
            {plato.imagen && plato.imagen.startsWith('uploads/') && (
                <img 
                    src={`http://localhost:3000/${plato.imagen}`} 
                    alt={plato.nombre}
                />
            )}
            <h3>{plato.nombre}</h3>
            <p>{plato.descripcion}</p>
            <p>
                <strong>Región:</strong> {plato.region}
            </p>
            <div>
                <span>{plato.tipo}</span>
                <span>{plato.dificultad}</span>
                <span>{plato.tiempoCoccion} minutos</span>
            </div>
        </div>
    );
}

export default PlatoCard;
