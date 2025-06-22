import express from "express";
import multer from "multer";
import path from "path";
import {getPlatos, setPlato, getPlatoByNombre, deletePlatoById, updatePlatoById, getPlatosByTipo, getPlatosByDificultad, getPlatosByTiempoCoccion, getPlatoById} from "../controllers/platoController.js";
import { validacionToken } from "../middlewares/auth.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/tipo/:tipo", getPlatosByTipo);
router.get("/dificultad/:dificultad", getPlatosByDificultad);
router.get("/tiempo/:tiempo", getPlatosByTiempoCoccion);
router.get("/nombre/:nombre", getPlatoByNombre);
router.get("/:id", getPlatoById);
router.get("/", getPlatos);
router.post("/", validacionToken, upload.single('imagen'), setPlato);
router.put("/:id", validacionToken, upload.single('imagen'), updatePlatoById);
router.delete("/:id", validacionToken, deletePlatoById);

export default router;