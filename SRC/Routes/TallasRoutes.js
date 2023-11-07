import { Router } from "express";
import {
    GetTallas,
    GetTalla,
    saveTalla,
    UpdateTalla,

} from "../Controllers/TallasController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Tallas", isAuthenticated, checkAccess('Gestión de Tallas', 'Administrador'), GetTallas);
router.get("/Talla", GetTalla);
router.post("/Talla", saveTalla);
router.put("/Talla/:id", UpdateTalla);

export default router;
