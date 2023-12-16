// configuracionesMiddleware.js
import * as ConfiguracionesModel from '../models/ConsultaConfiguraciones';

const configuracionesMiddleware = async (req, res, next) => {
    try {
        const configuraciones = await ConfiguracionesModel.mostrarConfiguraciones();

        // Verificar si hay configuraciones y tomar la primera
        const primeraConfiguracion = configuraciones.length > 0 ? configuraciones[0] : null;

        // Asignar a res.locals.userData
        res.locals.DataLocal = {
            NombreNegocio: primeraConfiguracion ? primeraConfiguracion.NombreNegocio : 'Usuario no autenticado',
            LogoLocal: primeraConfiguracion ? primeraConfiguracion.LogoLocal : 'Usuario no autenticado',
        };

        next();
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export default configuracionesMiddleware;
