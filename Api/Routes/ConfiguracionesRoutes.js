import express from 'express';
import multer from 'multer';
import path from 'path';
import * as ConfiguracionesController from '../Controllers/ConfiguracionesController';
import * as authMiddleware from '../Middleware/authMiddleware';

const router = express.Router();
const publicImagesDirectory = path.join(process.cwd(), '.','Cliente', 'public', 'imagenes');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, publicImagesDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});





const upload = multer({ storage: storage });



router.get("/api/configuracion/page", authMiddleware.isAuthenticated, ConfiguracionesController.renderConfiguracionPage);
router.get("/api/historial", ConfiguracionesController.GetHistorialConfiguracione);
router.get("/api/configuraciones", ConfiguracionesController.Configuraciones);
router.post("/api/configuracion", upload.single('logoLocal'), ConfiguracionesController.saveConfiguracion);
router.put("/api/configuracion/:id", upload.single('logoLocal'), ConfiguracionesController.UpdateConfiguracion);
router.put('/api/configuracion/DarDeBaja/:id', ConfiguracionesController.DarDeBaja);
router.put('/api/configuracion/Activar/:id', ConfiguracionesController.Activar);
console.log("Rutas registradas en Express:", router.stack.map(layer => layer.route.path));

export default router;
