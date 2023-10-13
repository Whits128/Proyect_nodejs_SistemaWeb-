import { Router } from "express";
import {
    GetCategorias,
    GetCategoria,
    saveCategoria,
    UpdateCategoria,

} from "../Controllers/Categoriacontroller";



const router = Router();


router.get("/Categorias", GetCategorias);

router.get("/Categoria", GetCategoria);

router.post("/Categoria", saveCategoria);


//router.delete("/Categoria/:Id", deleteTalla);

router.put("/Categoria/:id", UpdateCategoria);
/*router.get("/tallas/count", getTotalTallas);

router.get("/tallas/:id", getTallasById);


*/

export default router;
