import Ingrediente from "../models/ingredienteModel.js";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

const validarCamposRequeridos = (datos) => {
    const { nombre, descripcion, tipo } = datos;
    if (!nombre || !descripcion || !tipo) {
        return { esValido: false, mensaje: "Todos los campos son requeridos: nombre, descripcion, tipo, alergeno (Opcional)" };
    }
    return { esValido: true };
};

const validarTipoIngrediente = (tipo) => {
    const tiposValidos = ['vegetal', 'carne', 'lácteo', 'cereal', 'condimento', 'otro'];
    if (!tiposValidos.includes(tipo)) {
        return { 
            esValido: false, 
            mensaje: "Tipo de ingrediente no válido. Debe ser uno de: " + tiposValidos.join(', ')
        };
    }
    return { esValido: true };
};

const validarId = (id) => {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return { esValido: false, mensaje: "ID no válido" };
    }
    return { esValido: true };
};

const validarCamposUpdate = (datos) => {
    if (Object.keys(datos).length === 0) {
        return { esValido: false, mensaje: "Debe proporcionar al menos un campo para actualizar" };
    }
    return { esValido: true };
};

const validarTiposDatos = (datos) => {
    const { nombre, descripcion, tipo, alergeno } = datos;
    
    if (nombre && typeof nombre !== 'string') {
        return { esValido: false, mensaje: "El nombre debe ser una cadena de texto" };
    }
    
    if (descripcion && typeof descripcion !== 'string') {
        return { esValido: false, mensaje: "La descripción debe ser una cadena de texto" };
    }
    
    if (tipo && typeof tipo !== 'string') {
        return { esValido: false, mensaje: "El tipo debe ser una cadena de texto" };
    }
    
    if (alergeno !== undefined && typeof alergeno !== 'boolean') {
        return { esValido: false, mensaje: "El alérgeno debe ser un valor booleano (true/false)" };
    }
    
    return { esValido: true };
};

const getIngredientes = async (req, res) => {
    try {
        const ingredientes = await Ingrediente.find({ habilitado: true });
        res.status(200).json({ msg: "OK", data: ingredientes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", data: [] });
    }
}

const getAllIngredientes = async (req, res) => {
    try {
        const ingredientes = await Ingrediente.find();
        res.status(200).json({ msg: "OK", data: ingredientes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", data: [] });
    }
}

const setIngrediente = async (req, res) => {
    try {
        const validacionTipos = validarTiposDatos(req.body);
        if (!validacionTipos.esValido) {
            return res.status(400).json({ msg: validacionTipos.mensaje });
        }

        const validacionCampos = validarCamposRequeridos(req.body);
        if (!validacionCampos.esValido) {
            return res.status(400).json({ msg: validacionCampos.mensaje });
        }

        const validacionTipo = validarTipoIngrediente(req.body.tipo);
        if (!validacionTipo.esValido) {
            return res.status(400).json({ msg: validacionTipo.mensaje });
        }

        const { nombre, descripcion, tipo, alergeno } = req.body;
        const ingrediente = await Ingrediente.findOne({ nombre: nombre });
        if (ingrediente) {
            return res.status(404).json({ msg: "El ingrediente ya existe" });
        }
        const ingredienteNuevo = new Ingrediente({ nombre, descripcion, tipo, alergeno });
        ingredienteNuevo.save();
        const id = ingredienteNuevo._id;
        res.status(202).json({ msg: "Ingrediente guardado", id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor. No se pudo guardar el ingrediente", error });
    }
}

const getIngredienteById = async (req, res) => {
    try {
        const validacionId = validarId(req.params.id);
        if (!validacionId.esValido) {
            return res.status(400).json({ msg: validacionId.mensaje });
        }

        const ingrediente = await Ingrediente.findById(req.params.id);
        if (!ingrediente) {
            return res.status(404).json({ msg: "Ingrediente no encontrado en la base de datos", data: [] });
        }

        res.status(200).json({ msg: "OK", data: ingrediente });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", error });
    }
} 

const updateIngredienteById = async (req, res) => {
    try {
        const validacionTipos = validarTiposDatos(req.body);
        if (!validacionTipos.esValido) {
            return res.status(400).json({ msg: validacionTipos.mensaje });
        }

        const validacionId = validarId(req.params.id);
        if (!validacionId.esValido) {
            return res.status(400).json({ msg: validacionId.mensaje });
        }

        const validacionCampos = validarCamposUpdate(req.body);
        if (!validacionCampos.esValido) {
            return res.status(400).json({ msg: validacionCampos.mensaje });
        }

        if (req.body.tipo) {
            const validacionTipo = validarTipoIngrediente(req.body.tipo);
            if (!validacionTipo.esValido) {
                return res.status(400).json({ msg: validacionTipo.mensaje });
            }
        }

        const { id } = req.params;
        const ingredienteNuevo = await Ingrediente.findByIdAndUpdate(
            id, 
            { $set: req.body },
            { new: true }
        );

        if (!ingredienteNuevo) {
            return res.status(404).json({ msg: "ID del ingrediente no encontrado", data: [] });
        }
        
        res.status(200).json({ msg: "OK", data: ingredienteNuevo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", error });
    }
} 

const getIngredientesByTipo = async (req, res) => {
    try {
        const validacionTipo = validarTipoIngrediente(req.params.tipo);
        if (!validacionTipo.esValido) {
            return res.status(400).json({ msg: validacionTipo.mensaje });
        }

        const tipo = req.params.tipo;
        const ingredientes = await Ingrediente.find({ tipo: tipo });
        if (ingredientes.length === 0) {
            return res.status(404).json({ msg: "No hay ingredientes de ese tipo", data: [] });
        }
        res.status(200).json({ msg: "OK", data: ingredientes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", error });
    }
}

const getIngredienteByNombre = async (req, res) => {
    try {
        const nombre = req.params.nombre;
        const ingrediente = await Ingrediente.find({ 
            nombre: { $regex: nombre, $options: 'i' } 
        });
        if (ingrediente.length === 0) {
            return res.status(404).json({ msg: "Plato no encontrado", data: [] });
        } else {
            res.status(200).json({ msg: "OK", data: ingrediente });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor", error });
    }
} 

export {getIngredientes, setIngrediente, getIngredienteById, updateIngredienteById, getIngredientesByTipo, getIngredienteByNombre, getAllIngredientes};