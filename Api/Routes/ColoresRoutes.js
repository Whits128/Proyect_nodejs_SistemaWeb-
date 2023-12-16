import express from 'express';
import * as ColoresController from '../Controllers/ColoresController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/color', ColoresController.GetColor);
router.get('/api/color/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, ColoresController.renderColorPage);
router.post('/api/color', ColoresController.guardarColor);
router.put('/api/color/:id', ColoresController.updateColor);
router.put('/api/color/dardebaja/:id', ColoresController.darDeBajaColor);
router.put('/api/color/activar/:id', ColoresController.activarColor);

export default router;
