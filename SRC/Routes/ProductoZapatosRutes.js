import { Router } from "express";
import {
    GetProductos,
    GetProducto,
    saveProducto,
    UpdateProducto,

} from "../Controllers/ProductoZapatosController";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();


router.get("/Productos", GetProductos);

router.get("/Producto", GetProducto);

router.post("/Producto", saveProducto);


//router.delete("/Categoria/:Id", deleteTalla);

router.put("/Producto/:id", UpdateProducto);
/*router.get("/tallas/count", getTotalTallas);

router.get("/tallas/:id", getTallasById);


*/

export default router;
