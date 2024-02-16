import express from 'express';
import multer from 'multer';
import path from 'path';
import * as ConfiguracionesController from '../Controllers/ConfiguracionesController';
import * as authMiddleware from '../Middleware/authMiddleware';
import  configuracionesMiddleware from '../Middleware/Middlewareparaconfiguraciones'; // Ajusta la ruta según tu estructura

const router = express.Router();
const publicImagesDirectory = path.join(process.cwd(), '.', 'Cliente', 'public', 'imagenes');

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, publicImagesDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Configuración de Multer para aceptar solo imágenes JPEG y PNG
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Solo se permiten archivos JPEG y PNG.');
        }
    }
});

// Middleware para manejar errores de Multer
const handleMulterErrors = (req, res, next) => {
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }
    next();
};

// Rutas
router.get("/api/historial/page", authMiddleware.isAuthenticated,authMiddleware.checkAccess, ConfiguracionesController.renderHistorialPage);
router.get("/api/configuracion/page", authMiddleware.isAuthenticated,authMiddleware.checkAccess, ConfiguracionesController.renderConfiguracionPage);
router.get("/api/historial", ConfiguracionesController.GetHistorialConfiguracione);
router.get("/api/configuraciones", ConfiguracionesController.Configuraciones);

router.post("/api/configuracion/post", upload.single('logoLocal'), handleMulterErrors, ConfiguracionesController.saveConfiguracion);
router.put("/api/configuracion/:id", upload.single('logoLocal'), handleMulterErrors,configuracionesMiddleware, ConfiguracionesController.updateConfiguracion);

router.put('/api/configuracion/DarDeBaja/:id', ConfiguracionesController.DarDeBaja);
router.put('/api/configuracion/Activar/:id', ConfiguracionesController.Activar);

console.log("Rutas registradas en Express:", router.stack.map(layer => layer.route.path));

export default router;
