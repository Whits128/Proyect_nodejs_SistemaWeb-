
import express from 'express';
import * as ConfiguracionAccesoController from '../Controllers/ConfiguracionAccesoController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();
router.get('/api/configuracionAcceso', ConfiguracionAccesoController.GetConfiguracionAcceso);
router.get('/api/configuracionAcceso/page',authMiddleware.isAuthenticated, ConfiguracionAccesoController.renderAccesosPage);

router.get('/api/configuracionAcceso/rol', ConfiguracionAccesoController.GetRol);
router.get('/api/configuracionAcceso/recursos', ConfiguracionAccesoController.GetRecursos);
router.post('/api/configuracionAcceso/post', ConfiguracionAccesoController.guardarAcceso);
router.put('/api/configuracionAcceso/:id', ConfiguracionAccesoController.updateAcceso);


export default router;
