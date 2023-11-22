import express from 'express';
import {
  GetZapatosDanados,
  GetZapatosDanado,
  saveZapatosDanado,
  UpdateZapatosDanado,
} from '../Controllers/ZapatosDañadosController';

const router = express.Router();

router.get('/ZapatosDanados', GetZapatosDanados);
router.get('/ZapatosDanado', GetZapatosDanado);
router.post('/ZapatosDanado', saveZapatosDanado);
router.put('/ZapatosDanado/:id', UpdateZapatosDanado);
console.log("Rutas registradas en Express:", router.stack.map(layer => layer.route.path));
export default router;
