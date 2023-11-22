import { Router } from "express";
import {
    GetMaterialesZapatos,
    GetMaterialesZapato,
    saveMaterialesZapato,
    UpdateMaterialesZapato,
    DarDeBaja,
    Activar
} from "../Controllers/MaterialesZapatosController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/MaterialesZapatos",isAuthenticated, checkAccess, GetMaterialesZapatos);
router.get("/MaterialesZapato", GetMaterialesZapato);
router.post("/MaterialesZapato", saveMaterialesZapato);
router.put("/MaterialesZapato/:id", UpdateMaterialesZapato);
router.put('/MaterialesZapato/DarDeBaja/:id', DarDeBaja);
router.put('/MaterialesZapato/Activar/:id', Activar);
export default router;
