import { Router } from "express";
import {
    GetCategorias,
    GetCategoria,
    saveCategoria,
    UpdateCategoria,

} from "../Controllers/Categoriacontroller";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Categorias", isAuthenticated, checkAccess('Categoria', 'Admin'), GetCategorias);
router.get("/Categorias", isAuthenticated, checkAccess('Categoria', 'Empleado'), GetCategorias);

  


router.get("/Categoria", GetCategoria);

router.post("/Categoria", saveCategoria);


//router.delete("/Categoria/:Id", deleteTalla);

router.put("/Categoria/:id", UpdateCategoria);
/*router.get("/tallas/count", getTotalTallas);

router.get("/tallas/:id", getTallasById);


*/

export default router;
