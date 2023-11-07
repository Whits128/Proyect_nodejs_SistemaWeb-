import { Router } from "express";
import {
    GetCategorias,
    GetCategoria,
    saveCategoria,
    UpdateCategoria,

} from "../Controllers/Categoriacontroller";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Categorias", isAuthenticated, checkAccess('Gestión de Categorias', 'Administrador'), GetCategorias);


  


router.get("/Categoria", GetCategoria);

router.post("/Categoria", saveCategoria);


//router.delete("/Categoria/:Id", deleteTalla);

router.put("/Categoria/:id", UpdateCategoria);
/*router.get("/tallas/count", getTotalTallas);

router.get("/tallas/:id", getTallasById);


*/

export default router;
