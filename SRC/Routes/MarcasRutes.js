import { Router } from "express";
import {
    GetMarcas,
    GetMarca,
    saveMarca,
    UpdateMarca,
    DarDeBaja,
    Activar
} from "../Controllers/MarcasController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Marcas", isAuthenticated, checkAccess, GetMarcas);
router.get("/Marca", GetMarca);
router.post("/Marca", saveMarca);
router.put("/Marca/:id", UpdateMarca);
router.put('/Marca/DarDeBaja/:id', DarDeBaja);
router.put('/Marca/Activar/:id', Activar);
export default router;
