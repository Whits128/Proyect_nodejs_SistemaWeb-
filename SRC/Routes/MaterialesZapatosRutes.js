import { Router } from "express";
import {
    GetMaterialesZapatos,
    GetMaterialesZapato,
    saveMaterialesZapato,
    UpdateMaterialesZapato,

} from "../Controllers/MaterialesZapatosController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/MaterialesZapatos", GetMaterialesZapatos);
router.get("/MaterialesZapato", GetMaterialesZapato);
router.post("/MaterialesZapato", saveMaterialesZapato);
router.put("/MaterialesZapato/:id", UpdateMaterialesZapato);

export default router;
