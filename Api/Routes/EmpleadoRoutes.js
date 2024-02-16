
import express from 'express';
import * as EmpleadoController from '../Controllers/EmpleadoController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/empleado', EmpleadoController.GetEmpleado);
router.get('/api/empleado/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, EmpleadoController.renderEmpleadoPage);
router.post('/api/empleado', EmpleadoController.guardarEmpleado);
router.put('/api/empleado/:id', EmpleadoController.updateEmpleado);
router.put('/api/empleado/dardebaja/:id', EmpleadoController.darDeBajaEmpleado);
router.put('/api/empleado/activar/:id', EmpleadoController.activarEmpleado);

export default router;
