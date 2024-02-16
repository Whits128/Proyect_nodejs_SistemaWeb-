
import express from 'express';
import * as VentaController from '../Controllers/VentaController';

import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

router.get('/api/ventas/', VentaController.GetVentas);


router.get('/api/devolucion/', VentaController.GetDevolucion);
router.get('/api/venta/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, VentaController.renderVentasPage);
router.get('/api/venta/devolucion/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, VentaController.renderDevolucionVPage);
router.get('/api/venta/devolucion/registrar/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, VentaController.renderDevolucionRegistrarPage);
router.post('/api/venta', VentaController.crearVenta);
router.post('/api/devolucion/venta', VentaController.DevolucionVenta);
router.get("/api/venta/generarfactura/:id", VentaController.generarFactura);
router.get("/api/venta/Notacredito/:id", VentaController.GetNotacredito);
router.get('/api/venta/detalleVenta/:id', VentaController.ObtenerDetallesVentaaPorCodigo);
export default router;
