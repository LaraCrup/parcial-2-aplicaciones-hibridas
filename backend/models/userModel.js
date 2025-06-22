import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
        maxlength: [16, 'El nombre no puede tener más de 16 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: [true, 'El email ya está registrado'],
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'El formato del email es inválido']
    },
    password: {
        type: String, 
        required: [true, 'El password es obligatorio'],
        minlength: [4, 'La contraseña debe tener al menos 4 caracteres']
    },
});

const User = mongoose.model('user', userSchema);

export default User;