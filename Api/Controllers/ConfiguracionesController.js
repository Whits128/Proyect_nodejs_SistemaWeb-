
import { getConnection ,sql} from "../models/connection";
import * as ConfiguracionesModel from '../models/ConsultaConfiguraciones';
import fs from 'fs';

// Modifica la función encodeToBase64
const encodeToBase64 = (filePath) => {
  const data = fs.readFileSync(filePath);
  return data;
};

export const renderConfiguracionPage = async (req, res) => {
  try {
 
// Obtén el usuario autenticado desde res.locals.userData
const user = res.locals.userData;

    // Obtén las configuraciones
  
    res.render('CtlConfiguracion.ejs', { pageTitle: 'Configuraciones',user });
    console.log('user',user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const renderHistorialPage = async (req, res) => {
  try {
    res.render('HistorialConfiguraciones.ejs', { pageTitle: 'Historial Configuraciones ' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};




// En tu controlador (ConfiguracionesController.js), antes de enviar los datos al cliente:
export const Configuraciones = async (req, res) => {
  try {
    const configuraciones = await ConfiguracionesModel.mostrarConfiguraciones();

    // Convertir datos binarios a base64 antes de enviar al cliente
    const configuracionesConBase64 = configuraciones.map(config => {
      if (config.LogoLocal instanceof Buffer) {
        const base64Data = config.LogoLocal.toString('base64');
        return { ...config, LogoLocal: base64Data };
      }
      return config;
    });

    res.json(configuracionesConBase64);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




// En tu controlador (ConfiguracionesController.js), antes de enviar los datos al cliente:
export const GetHistorialConfiguracione = async (req, res) => {
  try {
    const historial = await ConfiguracionesModel.mostrarhistorial();  
  res.json(historial);
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const saveConfiguracion = async (req, res) => {
  const { nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion } = req.body;

  if (!nombreNegocio) {
    return res.status(400).json({ msg: "Bad Request. Please provide a nombreNegocio" });
  }

  if (!req.file) {
    return res.status(400).json({ msg: "No se proporcionó ninguna imagen" });
  }

  try {
    const logoLocalPath = req.file.path;
    const logoLocalBinary = encodeToBase64(logoLocalPath);

    const pool = await getConnection();

    const result = await pool
      .request()
      .input('nombreNegocio', sql.NVarChar, nombreNegocio)
      .input('logoLocal', sql.VarBinary(sql.MAX), logoLocalBinary)  // Cambio a sql.VarBinary
      .input('ruc', sql.NVarChar, ruc)
      .input('telefonos', sql.NVarChar, telefonos)
      .input('correo', sql.NVarChar, correo)
      .input('direccion', sql.NVarChar, direccion)
      .input('usuarioModificacion', sql.NVarChar, usuarioModificacion)
      .execute('InsertarConfiguracionYHistorial');

    console.log("Nuevo registro creado:", { nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion });

    res.json({ nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const updateConfiguracion = async (req, res) => {
  const {
    
    nombreNegocio,
    ruc,
    telefonos,
    correo,
    direccion,
    usuarioModificacion,
  } = req.body;
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ msg: "Bad Request. Please provide PKConfiguraciones" });
  }

  try {
    const pool = await getConnection();

    let logoLocalBinary = null;
    if (req.file) {
      const logoLocalPath = req.file.path;
      logoLocalBinary = encodeToBase64(logoLocalPath);
    }

    const result = await pool
      .request()
      .input('PKConfiguraciones', sql.Int, id)
      .input('NombreNegocio', sql.NVarChar, nombreNegocio || null)
      .input('LogoLocal', sql.VarBinary(sql.MAX), logoLocalBinary || null)
      .input('RUC', sql.NVarChar, ruc || null)
      .input('Telefonos', sql.NVarChar, telefonos || null)
      .input('Correo', sql.NVarChar, correo || null)
      .input('Direccion', sql.NVarChar, direccion || null)
      .input('UsuarioModificacion', sql.NVarChar, usuarioModificacion || null)
      .execute('ActualizarConfiguracion');

    console.log("Registro actualizado:", {
      nombreNegocio,
      ruc,
      telefonos,
      correo,
      direccion,
      usuarioModificacion,
    });
    

    res.json({
      nombreNegocio,
      ruc,
      telefonos,
      correo,
      direccion,
      usuarioModificacion,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};




export const DarDeBaja = async (req, res) => {
    try {
      console.log('Recibiendo solicitud para dar de baja la Talla con ID:', req.params.id);
      
      const pool = await getConnection();
      await pool
        .request()
        .input("codigo", req.params.id) 
        .query(querys.DarDeBajaConfiguraciones);
      
      console.log('Talla dada de baja exitosamente.');
      res.json({ msg: "Size deactivated successfully" });
    } catch (error) {
      console.error('Error al dar de baja la Talla:', error);
      res.status(500);
      res.send(error.message);
    }
  };
  
  export const Activar = async (req, res) => {
    try {
      console.log('Recibiendo solicitud para activar la Talla con ID:', req.params.id);
      
      const pool = await getConnection();
      await pool
        .request()
        .input("codigo", req.params.id) 
        .query(querys.ActivarConfiguraciones);
      
      console.log('Talla activada exitosamente.');
      res.json({ msg: "Size activated successfully" });
    } catch (error) {
      console.error('Error al activar la Talla:', error);
      res.status(500);
      res.send(error.message);
    }
  };
  