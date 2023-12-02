
import express from 'express';
import * as ProveedoresController from '../Controllers/ProveedoresController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/Proveedor', ProveedoresController.GetProveedores);
router.get('/api/Proveedor/page',authMiddleware.isAuthenticated, ProveedoresController.renderProveedorPage);
router.post('/api/Proveedor', ProveedoresController.guardarProveedores);
router.put('/api/Proveedor/:id', ProveedoresController.updateProveedores);
router.put('/api/Proveedor/dardebaja/:id', ProveedoresController.darDeBajaProveedores);
router.put('/api/Proveedor/activar/:id', ProveedoresController.activarProveedores);

export default router;
