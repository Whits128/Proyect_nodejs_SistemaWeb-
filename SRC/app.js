import express from 'express'

import config from './config';

import  InicioSesionRutes from "./Routes/InicioSesionRutes";
import  CategoriaRutes from "./Routes/CategoriaRutes";
import  ProductoZapatosRutes from "./Routes/ProductoZapatosRutes";
import InicioRutes from "./Routes/InicioRutes";
import morgan from "morgan";
import path from "path";
const expressEjsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const app = express()

// settings
app.set('port', config.port)
//para poder trabajar con las cookies
app.use(cookieParser())
//app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.json());
app.set('views', path.join(__dirname, 'views')); // Ruta correcta al directorio de vistas

app.use(express.static(path.join(process.cwd(), 'Public')));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(expressEjsLayouts);


// Routes
app.use(InicioSesionRutes);
app.use(InicioRutes);
app.use(CategoriaRutes);
app.use(ProductoZapatosRutes);

export default app
