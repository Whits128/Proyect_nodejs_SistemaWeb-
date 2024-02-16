import express from 'express';
import * as categoriaController from '../Controllers/Categoriacontroller';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'

router.get('/api/categorias/page', authMiddleware.isAuthenticated,authMiddleware.checkAccess, categoriaController.renderCategoriasPage);
router.get('/api/categorias', categoriaController.GetCategorias);
router.post('/api/categorias', categoriaController.guardarCategoria);
router.put('/api/categorias/:id', categoriaController.updateCategoria);
router.put('/api/categorias/dardebaja/:id', categoriaController.darDeBajaCategoria);


export default router;
