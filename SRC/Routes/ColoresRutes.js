import { Router } from "express";
import {
    GetColores,
    GetColor,
    saveColor,
    UpdateColor,
    DarDeBaja,
    Activar
} from "../Controllers/ColoresController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Colores", isAuthenticated, checkAccess, GetColores);
router.get("/Color", GetColor);
router.post("/Color", saveColor);
router.put("/Color/:id", UpdateColor);
router.put('/Color/DarDeBaja/:id', DarDeBaja);
router.put('/Color/Activar/:id', Activar);
export default router;
