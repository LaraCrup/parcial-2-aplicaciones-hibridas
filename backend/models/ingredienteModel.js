import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ingredienteSchema = new Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    descripcion: { 
        type: String, 
        required: [true, 'La descripción es requerida']
    },
    tipo: { 
        type: String, 
        enum: {
            values: ['vegetal', 'carne', 'lácteo', 'cereal', 'condimento', 'otro'],
            message: '{VALUE} no es un tipo válido'
        },
        required: [true, 'El tipo es requerido']
    },
    alergeno: { 
        type: Boolean,
        default: false
    },
    habilitado: {
        type: Boolean,
        default: true
    }
});

const Ingrediente = mongoose.model('Ingrediente', ingredienteSchema);
export default Ingrediente;