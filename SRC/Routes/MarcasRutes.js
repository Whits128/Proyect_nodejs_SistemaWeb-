import { Router } from "express";
import {
    GetMarcas,
    GetMarca,
    saveMarca,
    UpdateMarca,

} from "../Controllers/MarcasController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Marcas", isAuthenticated, checkAccess('Gestión de Categorias', 'Administrador'), GetMarcas);
router.get("/Marca", GetMarca);
router.post("/Marca", saveMarca);
router.put("/Marca/:id", UpdateMarca);

export default router;
