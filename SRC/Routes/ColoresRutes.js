import { Router } from "express";
import {
    GetColores,
    GetColor,
    saveColor,
    UpdateColor,

} from "../Controllers/ColoresController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Colores", isAuthenticated, checkAccess('Gestión de Categorias', 'Administrador'), GetColores);
router.get("/Color", GetColor);
router.post("/Color", saveColor);
router.put("/Color/:id", UpdateColor);

export default router;
