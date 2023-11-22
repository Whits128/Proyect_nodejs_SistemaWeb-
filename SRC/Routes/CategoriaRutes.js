import { Router } from "express";
import {
    GetCategorias,
    GetCategoria,
    saveCategoria,
    UpdateCategoria,
    DarDeBaja,
    Activar
} from "../Controllers/Categoriacontroller";
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";


const router = Router();

router.get("/Categorias", isAuthenticated, checkAccess, GetCategorias);
router.get("/Categoria", GetCategoria);
router.post("/Categoria", saveCategoria)
router.put("/Categoria/:id", UpdateCategoria);
router.put('/Categoria/DarDeBaja/:id', DarDeBaja);
router.put('/Categoria/Activar/:id', Activar);



export default router;
