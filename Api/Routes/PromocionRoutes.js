
import express from 'express';
import * as PromocionController from '../Controllers/PromocionController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/promociones', PromocionController.GetPromociones);
router.get('/api/promociones/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, PromocionController.renderPromocionesPage);
router.post('/api/promociones', PromocionController.guardarPromociones);
router.put('/api/promociones/:id', PromocionController.updatePromociones);
router.put('/api/promociones/dardebaja/:id', PromocionController.darDeBajaPromociones);
router.put('/api/promociones/activar/:id', PromocionController.activarPromociones);

export default router;
