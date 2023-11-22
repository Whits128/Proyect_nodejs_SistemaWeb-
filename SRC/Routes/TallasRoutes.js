import { Router } from "express";
import {
    GetTallas,
    GetTalla,
    saveTalla,
    UpdateTalla,
    DarDeBaja,
    Activar

} from "../Controllers/TallasController";
import * as validator  from "../Middleware/validarFormulario"
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Tallas",isAuthenticated, checkAccess, GetTallas);
router.get("/Talla", GetTalla);
router.post("/Talla", saveTalla);
router.put("/Talla/:id", UpdateTalla);
router.put('/Talla/DarDeBaja/:id', DarDeBaja);
router.put('/Talla/Activar/:id', Activar);

export default router;
