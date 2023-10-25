import express from 'express';
const router = express.Router();
import {Login,isAuthenticated,registerUser,logout
} from  "../Controllers/InicioSesionController"  // Asegúrate de ajustar la ruta

router.get('/Inicio',isAuthenticated, (req, res) => {
    // El usuario está autenticado, continúa con la lógica del dashboard
    // Puedes acceder al usuario autenticado usando req.user
    // Por ejemplo: const user = req.user;
    res.render('Inicio.ejs',{user:req.user});
  });

  
  router.get('/', (req, res) => {
    res.render('Login', { layout: false, alert: false });
  })
  



router.post("/Login",Login);  
router.post("/registerUser",registerUser);
router.get('/logout',logout)

export default router;
