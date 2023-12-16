
import express from 'express';
import * as ComprasController from '../Controllers/ComprasController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/compra/obtenerporcodigo/:id', ComprasController.ObtenerDetallesCompraPorCodigo);

router.get('/api/compra/', ComprasController.GetCompras);
router.get('/api/compra/page',authMiddleware.isAuthenticated, ComprasController.renderComprasPage);
router.post('/api/compra', ComprasController.crearCompra);
router.put('/api/compra/editar/:id', ComprasController.editarCompra);
router.put('/api/compra/:id', ComprasController.completarCompra);

export default router;
