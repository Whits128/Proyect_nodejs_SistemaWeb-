
import express from 'express';
import * as MaterialesZapatosController from '../Controllers/MaterialesZapatosController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'
router.get('/api/materialesZapatos', MaterialesZapatosController.GetMaterialesZapato);
router.get('/api/materialesZapatos/page',authMiddleware.isAuthenticated, MaterialesZapatosController.renderMzapatosPage);
router.post('/api/materialesZapatos', MaterialesZapatosController.guardarMaterialesZapato);
router.put('/api/materialesZapatos/:id', MaterialesZapatosController.updateMaterialesZapato);
router.put('/api/materialesZapatos/dardebaja/:id', MaterialesZapatosController.darDeBajaMaterialesZapato);
router.put('/api/materialesZapatos/activar/:id', MaterialesZapatosController.activarMaterialesZapato);

export default router;
