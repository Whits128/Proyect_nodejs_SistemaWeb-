
import express from 'express';
import * as DatosDebajaController from '../Controllers/DatosDebajaController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();



router.get('/api/DatosDebaja/page', authMiddleware.isAuthenticated, DatosDebajaController.renderDatosDebajaPage);
router.post('/api/categorias/activar', DatosDebajaController.activarCategoria);
router.post('/api/bodega/activar', DatosDebajaController.activarBodega);

export default router;
