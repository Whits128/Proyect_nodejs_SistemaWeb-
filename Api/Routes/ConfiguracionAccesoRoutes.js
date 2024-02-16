
import express from 'express';
import * as ConfiguracionAccesoController from '../Controllers/ConfiguracionAccesoController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();
router.get('/api/configuracionAcceso', ConfiguracionAccesoController.GetConfiguracionAcceso);
router.get('/api/configuracionAcceso/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, ConfiguracionAccesoController.renderAccesosPage);

router.get('/api/configuracionAcceso/rol', ConfiguracionAccesoController.GetRol);
router.get('/api/configuracionAcceso/recursos', ConfiguracionAccesoController.GetRecursos);
router.get('/api/configuracionAcceso/acciones', ConfiguracionAccesoController.GetAcciones);
router.post('/api/configuracionAcceso/crear',ConfiguracionAccesoController.crearConfiguracionAcceso)
export default router;
