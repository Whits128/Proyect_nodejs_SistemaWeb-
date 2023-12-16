// Configuración del servidor (API)
import express from 'express';
import methodOverride from 'method-override';
import cors from 'cors';
import config from '../Config/config';
import CategoriaRoutes from './Routes/CategoriaRoutes';
import MarcaRoutes from './Routes/MarcaRoutes';
import ColoresRoutes from './Routes/ColoresRoutes';
import TallasRoutes from './Routes/TallasRoutes';
import BodegaRoute from './Routes/BodegaRoute';
import EmpleadoRoutes from './Routes/EmpleadoRoutes';
import ZapatosMaterialesMRoutes from './Routes/ZapatosMaterialesMRoutes';
import ProveedoresRoutes from './Routes/ProveedoresRoutes';
import PromocionRoutes from './Routes/PromocionRoutes';
import ProductoZapatosRutas from './Routes/ProductoZapatosRutas';
import RolRoutes from './Routes/RolRoutes';
import InicioSesionRoutes from './Routes/InicioSesionRoutes';
import InicioRoutes from './Routes/InicioRoutes';
import ConfiguracionesRoutes from './Routes/ConfiguracionesRoutes';
import ConfiguracionAccesoRoutes from './Routes/ConfiguracionAccesoRoutes';
import DatosDebajaRoutes from './Routes/DatosDebajaRoutes';
import InventarioRoute from './Routes/InventarioRoute';
import CompraRoutes from './Routes/CompraRoutes';
import configuracionesMiddleware from './Middleware/Middlewareparaconfiguraciones'; // Ajusta la ruta según tu estructura

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from "path";
const expressEjsLayouts = require('express-ejs-layouts');
const app = express();
app.use(methodOverride('_method', { methods: ['POST', 'GET','PUT'] }));

// Configuración del puerto
app.set('port', config.port);

// Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'Cliente', 'views'));

// Configura el middleware para archivos estáticos
app.use(express.static(path.join(__dirname,'..', 'Cliente', 'public')));

// Middleware para manejar CORS
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
}));

// Middleware para manejar JSON
app.use(express.json());

// Middleware para manejar datos de formularios URL-encoded
app.use(express.urlencoded({ extended: false }));

// Middleware para el registro de solicitudes en consola
app.use(morgan('dev'));

// Middleware para trabajar con cookies
app.use(cookieParser());
app.use(expressEjsLayouts);
app.use(configuracionesMiddleware);
// Rutas
app.use(CategoriaRoutes);
app.use(MarcaRoutes);
app.use(ColoresRoutes);
app.use(TallasRoutes);
app.use(BodegaRoute);
app.use(EmpleadoRoutes);
app.use(ZapatosMaterialesMRoutes);
app.use(ProveedoresRoutes);
app.use(RolRoutes);
app.use(PromocionRoutes);
app.use(InicioSesionRoutes);
app.use(InicioRoutes);
app.use(ConfiguracionesRoutes);
app.use(ConfiguracionAccesoRoutes);
app.use(ProductoZapatosRutas);
app.use(DatosDebajaRoutes);
app.use(InventarioRoute);
app.use(CompraRoutes);
export default app;
