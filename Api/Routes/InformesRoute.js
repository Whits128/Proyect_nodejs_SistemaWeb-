
import express from 'express';
import * as InformesController from '../Controllers/InformesController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

router.get('/api/informes/inventario', InformesController.GetInformeInventario);
router.get('/api/informes/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, InformesController.renderInformes);


export default router;
