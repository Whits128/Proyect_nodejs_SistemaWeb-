
import express from 'express';
import * as InventarioController from '../Controllers/InventarioController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/inventario', InventarioController.GetInventario);
router.get('/api/inventario/page',authMiddleware.isAuthenticated, InventarioController.renderInventarioPage);
router.post('/api/inventario', InventarioController.agregarProducto);
router.put('/api/inventario/:id', InventarioController.actualizarProducto);
export default router;
