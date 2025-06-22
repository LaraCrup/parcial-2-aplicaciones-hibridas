import  User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const secret_key = process.env.SECRET_KEY;
const salt = 10;

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ msg: "OK", data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", data: [] });
    }
}

const setUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "El email, nombre y la contraseña son obligatorios" });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: "El formato del email es inválido" });
    }

    if (name.length < 3 || name.length > 16) {
        return res.status(400).json({ msg: "El nombre debe tener entre 3 y 16 caracteres" });
    }

    if (password.length < 4) {
        return res.status(400).json({ msg: "La contraseña debe tener al menos 4 caracteres" });
    }

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(409).json({ msg: "El email ya está registrado" });
        }
        
        const passwordHash = await bcrypt.hash(password, salt);
        const userNew = new User({ name, email, password: passwordHash });
        
        await userNew.save();
        const id = userNew._id;
        
        const tokenData = {
            id: userNew._id,
            email: userNew.email,
        }
        const token = jwt.sign(tokenData, secret_key, {expiresIn: "1h"});
        
        res.status(201).json({ msg: "Usuario guardado", id, token });
    } catch (error) {
        if (error.name === "ValidationError") {
            const listError = Object.values(error.errors)[0].message;
            return res.status(400).json({ msg: "Error de validación", error: listError });
        } else if (error.code === 11000) {
            return res.status(409).json({ msg: "El email ya está registrado" });
        } else {
            console.error(error);
            res.status(500).json({ msg: "Error del servidor. No se pudo guardar el usuario" });
        }
    }
}

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ msg: "ID no encontrado", data: [] });
        } else {
            res.status(200).json({ msg: "OK", data: user });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", error });
    }
} 

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const status = await User.findByIdAndDelete(id);
        if (status) {
            res.status(200).json({ msg: "Usuario eliminado", data: [] });
        } else {
            return res.status(404).json({ msg: "Usuario no encontrado", data: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", error });
    }
}  

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updateData = {};
        let shouldGenerateToken = false;

        if (name !== undefined) {
            if (typeof name !== 'string' || name.length < 3 || name.length > 16) {
                return res.status(400).json({ msg: "El nombre debe tener entre 3 y 16 caracteres" });
            }
            updateData.name = name;
        }

        if (email !== undefined) {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ msg: "El formato del email es inválido" });
            }
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(409).json({ msg: "El email ya está en uso por otro usuario" });
            }
            updateData.email = email;
        }

        if (password !== undefined) {
            if (typeof password !== 'string' || password.length < 4) {
                return res.status(400).json({ msg: "La contraseña debe tener al menos 4 caracteres" });
            }
            updateData.password = await bcrypt.hash(password, salt);
            shouldGenerateToken = true;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ msg: "No hay datos válidos para actualizar" });
        }

        const userNew = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!userNew) {
            return res.status(404).json({ msg: "Usuario no encontrado", data: [] });
        } else {
            const { password, ...userResponse } = userNew.toObject();
            const response = { msg: "Usuario actualizado", data: userResponse };
            
            if (shouldGenerateToken) {
                const tokenData = {
                    id: userNew._id,
                    email: userNew.email,
                }
                const token = jwt.sign(tokenData, secret_key, {expiresIn: "1h"});
                response.token = token;
            }
            
            res.status(200).json(response);
        }
    } catch (error) {
        if (error.name === "ValidationError") {
            const listError = Object.values(error.errors)[0].message;
            return res.status(400).json({ msg: "Error de validación", error: listError });
        } else if (error.code === 11000) {
            return res.status(409).json({ msg: "El email ya está registrado" });
        } else {
            console.error(error);
            res.status(500).json({ msg: "Error del servidor", error });
        }
    }
} 

const auth = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    if(!user) {
        return res.status(404).json({msg: "El email es invalido"});
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(404).json({msg: "La contraseña es invalida"});
    }

    const data = {
        id: user._id,
        email: user.email,
        name: user.name
    }

    const token = jwt.sign(data, secret_key, {expiresIn: "1h"});
    return res.status(200).json({msg: "OK", token: token, user: { id: user._id, email: user.email, name: user.name }});
}

export {getUsers, setUser, getUserById, deleteUserById, updateUserById, auth};