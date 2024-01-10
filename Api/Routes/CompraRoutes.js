
import express from 'express';
import * as ComprasController from '../Controllers/ComprasController';
import * as GeneradordeFacturaPDF from '../Controllers/GeneradordeFacturaPDF';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/compra/detallecompra/:id', ComprasController.ObtenerDetallesCompraPorCodigo);

router.get('/api/compra/', ComprasController.GetCompras);
// Reemplaza "/api/compra/detallecompra/:codigoCompra" con la ruta real en tu aplicación
router.get("/api/compra/generarfactura/:id", ComprasController.generarFactura);

router.get('/api/compra/page',authMiddleware.isAuthenticated, ComprasController.renderComprasPage);
router.post('/api/compra', ComprasController.crearCompra);
router.post('/api/compra/crear-y-completar', ComprasController.crearYCompletarCompra);
router.put('/api/compra/editar/:id', ComprasController.editarCompra);
router.put('/api/compra/:id', ComprasController.completarCompra);

export default router;
