import { Router } from "express";
import multer from 'multer';
import path from 'path';
import {
    GetConfiguraciones,
    GetHistorialConfiguracione,
    GetConfiguracion,
    GetHistorialConfiguraciones,
    saveConfiguracion,
    UpdateConfiguracion,
    DarDeBaja,
    Activar
} from "../Controllers/ConfiguracionController";
import { isAuthenticated, checkAccess } from "../Controllers/InicioSesionController";

const router = Router();

// Obtén la ruta completa al directorio "Public/Imagenes" en tu proyecto
const publicImagesDirectory = path.join(process.cwd(), 'Public', 'imagenes');


// Configuración de Multer para manejar la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, publicImagesDirectory); // directorio donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});




const upload = multer({ storage: storage });

router.get("/Configuraciones", isAuthenticated, checkAccess, GetConfiguraciones);
router.get("/HistorialConfiguracione", GetHistorialConfiguracione);

router.get("/Configuracion", GetConfiguracion);
router.get("/HistorialConfiguraciones", GetHistorialConfiguraciones);
router.post("/Configuracion", upload.single('logoLocal'), saveConfiguracion);
router.put("/Configuracion/:id",upload.single('logoLocal'), UpdateConfiguracion);
router.put('/Configuracion/DarDeBaja/:id', DarDeBaja);
router.put('/Configuracion/Activar/:id', Activar);
console.log("Rutas registradas en Express:", router.stack.map(layer => layer.route.path));

export default router;
