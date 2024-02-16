import express from 'express';
import * as MarcaController from '../Controllers/MarcasController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

router.get('/api/marcas', MarcaController.GetMarcas);
router.get('/api/marcas/page',authMiddleware.isAuthenticated,authMiddleware.checkAccess, MarcaController.renderMarcapage);
router.post('/api/marcas', MarcaController.guardarMarca);
router.put('/api/marcas/:id', MarcaController.updateMarca);
router.put('/api/marcas/dardebaja/:id', MarcaController.darDeBajaMarca);
router.put('/api/marcas/activar/:id', MarcaController.activarMarca);

export default router;
