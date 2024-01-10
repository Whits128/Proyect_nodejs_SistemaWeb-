import express from 'express';
import * as UsuarioController from '../Controllers/UsuarioController';
import * as authMiddleware from '../Middleware/authMiddleware';
const router = express.Router();

// Agrupar rutas bajo el prefijo '/api/categorias'

router.get('/api/usuarios/page', authMiddleware.isAuthenticated, UsuarioController.renderUsuarioPage);
router.get('/api/usuarios',  UsuarioController.GetUsuarios);
router.get('/api/usuarios/historial/:id',  UsuarioController.MostrarHistorialLoginUsuario);
router.post('/api/usuario', UsuarioController.RegistrarUsuario);
router.put('/api/usuario/:id', UsuarioController.ActualizarUsuario);
router.put('/api/usuario/dardebaja/:id', UsuarioController.darDeBajaUsuario);
router.put('/api/usuario/activar/:id', UsuarioController.activarUsuario);
router.put('/api/usuario/cambiar-contrasena/:id', UsuarioController.ActualizarContrasenaUsuario);

export default router;
