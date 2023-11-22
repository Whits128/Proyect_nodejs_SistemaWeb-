import { Router } from "express";
import {
    GetBodegas,
    GetBodega,
    saveBodega,
    UpdateBodega,
    DarDeBaja,
    Activar
} from "../Controllers/BodegaController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Bodegas", isAuthenticated, checkAccess, GetBodegas);
router.get("/Bodega", GetBodega);
router.post("/Bodega", saveBodega)
router.put("/Bodega/:id", UpdateBodega);
router.put('/Bodega/DarDeBaja/:id', DarDeBaja);
router.put('/Bodega/Activar/:id', Activar);



export default router;
