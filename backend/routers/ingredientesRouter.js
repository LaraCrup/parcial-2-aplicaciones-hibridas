import express from "express";
import {getIngredientes, setIngrediente, getIngredienteById, updateIngredienteById, getIngredientesByTipo, getIngredienteByNombre, getAllIngredientes} from "../controllers/ingredienteController.js";

import { validacionToken } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getIngredientes);
router.get("/all", getAllIngredientes);
router.get("/:id", getIngredienteById);
router.post("/", validacionToken, setIngrediente);
router.put("/:id", validacionToken, updateIngredienteById);
router.get("/tipo/:tipo", getIngredientesByTipo);
router.get("/nombre/:nombre", getIngredienteByNombre);

export default router;