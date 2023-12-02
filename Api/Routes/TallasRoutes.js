import express from 'express';
import * as TallasController from '../Controllers/TallasController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/talla', TallasController.GetTalla);
router.get('/api/talla/page',authMiddleware.isAuthenticated, TallasController.renderTallasPage);
router.post('/api/talla', TallasController.guardarTalla);
router.put('/api/talla/:id', TallasController.updateTalla);
router.put('/api/talla/dardebaja/:id', TallasController.darDeBajaTalla);
router.put('/api/talla/activar/:id', TallasController.activarTalla);

export default router;
