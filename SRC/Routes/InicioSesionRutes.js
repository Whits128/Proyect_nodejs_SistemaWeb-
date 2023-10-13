import express from 'express';
const router = express.Router();
import { Login,registerUser } from  "../Controllers/InicioSesionController"  // Asegúrate de ajustar la ruta




router.post("/registerUser", registerUser);
router.post("/Login", Login);  // Utiliza el método Login que exportaste


export default router;
