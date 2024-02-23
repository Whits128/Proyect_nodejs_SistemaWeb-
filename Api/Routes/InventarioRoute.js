
import express from 'express';
import * as InventarioController from '../Controllers/InventarioController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/inventario', InventarioController.GetInventario);
router.get('/api/inventario/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, InventarioController.renderInventarioPage);
router.put('/api/inventario/:id', InventarioController.actualizarInventario);
export default router;
