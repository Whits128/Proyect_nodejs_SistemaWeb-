// routes/authRoutes.js
import express from 'express';
import * as InicioController from '../Controllers/InicioController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();

router.get('/Inicio',authMiddleware.isAuthenticated,authMiddleware.checkAccess, InicioController.GetInicio);
export default router;
