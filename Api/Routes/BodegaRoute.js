
import express from 'express';
import * as BodegaController from '../Controllers/BodegaController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/bodega', BodegaController.GetBodega);
router.get('/api/bodega/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, BodegaController.renderBodegaPage);
router.post('/api/bodega', BodegaController.guardarBodega);
router.put('/api/bodega/:id', BodegaController.updateBodega);
router.put('/api/bodega/dardebaja/:id', BodegaController.darDeBajaBodega);
router.put('/api/bodega/activar/:id', BodegaController.activarBodega);

export default router;
