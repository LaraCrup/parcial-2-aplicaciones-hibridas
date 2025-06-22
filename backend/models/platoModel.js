import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const platoSchema = new Schema({
    nombre: { 
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    descripcion: { 
        type: String,
        required: [true, 'La descripción es requerida']
    },
    region: { 
        type: String,
        required: [true, 'La región es requerida']
    },
    tipo: { 
        type: String, 
        enum: {
            values: ['dulce', 'salado'],
            message: '{VALUE} no es un tipo válido'
        },
        required: [true, 'El tipo es requerido']
    },
    ingredientes: {
        type: [String],
        required: [true, 'Los ingredientes son requeridos'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Debe haber al menos un ingrediente'
        }
    },
    tiempoCoccion: { 
        type: Number,
        required: [true, 'El tiempo de cocción es requerido'],
        min: [1, 'El tiempo de cocción debe ser mayor a 0']
    },
    dificultad: { 
        type: String, 
        enum: {
            values: ['fácil', 'media', 'difícil'],
            message: '{VALUE} no es una dificultad válida'
        },
        required: [true, 'La dificultad es requerida']
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es requerida (archivo local)']
    }
});

const Plato = mongoose.model('Plato', platoSchema);
export default Plato;