import express from 'express';
import * as ProductoZapatosController from '../Controllers/ProductoZapatosController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

router.get('/api/productos', ProductoZapatosController.getProducts);
router.get('/api/producto/page',authMiddleware.isAuthenticated, ProductoZapatosController.renderProductosPage);
router.post('/api/producto', ProductoZapatosController.addProduct);
router.put('/api/producto/:id', ProductoZapatosController.updateProduct);
router.put('/api/producto/dardebaja/:id', ProductoZapatosController.darDeBajaProducto);
router.put('/api/producto/activar/:id', ProductoZapatosController.activateProduct);

export default router;
