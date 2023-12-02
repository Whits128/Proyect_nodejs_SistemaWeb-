// routes/authRoutes.js
import express from 'express';
import * as InicioSesionController from '../Controllers/InicioSesionController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();
router.get('/', (req, res) => {
    res.render('Login.ejs', { layout: false, alert: false });
  })
  
router.post('/api/register', InicioSesionController.registerUser);
router.post('/Login', InicioSesionController.Login);
router.get('/logout',authMiddleware.isAuthenticated,InicioSesionController.logout)
export default router;
