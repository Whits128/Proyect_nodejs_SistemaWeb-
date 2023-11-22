import express from 'express';
import {
  GetPromociones,
  GetPromocion ,
  savePromocion ,
  UpdatePromocion ,
  DarDeBaja,
  Activar
} from '../Controllers/PromocionesController';
import {isAuthenticated,checkAccess} from"../Controllers/InicioSesionController";
const router = express.Router();

router.get('/Promociones',isAuthenticated, checkAccess,GetPromociones );
router.get('/Promocion',GetPromocion );
router.post('/Promocion',savePromocion );
router.put('/Promocion/:id',UpdatePromocion );
router.put('/Promocion/DarDeBaja/:id', DarDeBaja);
router.put('/Promocion/Activar/:id', Activar);
console.log("Rutas registradas en Express:", router.stack.map(layer => layer.route.path));
export default router;
