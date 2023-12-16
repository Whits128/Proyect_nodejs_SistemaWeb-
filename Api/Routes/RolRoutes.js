
import express from 'express';
import * as RolController from '../Controllers/RolController.';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/rol', RolController.GetRol);
router.get('/api/rol/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, RolController.renderRolPage);
router.post('/api/rol', RolController.guardarRol);
router.put('/api/rol/:id', RolController.updateRol);
router.put('/api/rol/dardebaja/:id', RolController.darDeBajaRol);
router.put('/api/rol/activar/:id', RolController.activarRol);

export default router;
