
import { getConnection ,sql} from "../models/connection";
import * as ConfiguracionesModel from '../models/ConsultaConfiguraciones';
import fs from 'fs';

const encodeToBase64 = (filePath) => {
    const data = fs.readFileSync(filePath);
    return data.toString('base64');
};
export const renderConfiguracionPage = async (req, res) => {
  try {
 
// Obtén el usuario autenticado desde res.locals.userData
const user = res.locals.userData;

    // Renderiza la vista CtlConfiguracion.ejs con las configuraciones y detalles del usuario
    res.render('CtlConfiguracion.ejs', { pageTitle: 'Configuraciones',user });
 
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const obtenerNombreLocal = async (req, res) => {
  try {
      // Obtén la configuración que incluye el nombre del local
      const configuraciones = await ConfiguracionesModel.mostrarConfiguraciones();

      // Extrae el nombre del local de la primera configuración (ajusta esto según tu lógica)
      const nombreLocal = configuraciones.length > 0 ? configuraciones[0].NombreNegocio : '';

      return nombreLocal;
  } catch (error) {
      console.error('Error al obtener configuraciones:', error);
      throw error; // Puedes manejar este error según tus necesidades
  }
};





export const Configuraciones = async (req, res) => {
  try {
    const config = await ConfiguracionesModel.mostrarConfiguraciones();
    res.json(config);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
export const GetHistorialConfiguracione = async (req, res) => {
  try {
    const pool = await getConnection();
    const historial= await pool.request().query('SELECT H.PKHistorial, C.NombreNegocio AS NombreLocal, H.ColumnaModificada,  H.ValorAntiguo, H.ValorNuevo, H.FechaModificacion, H.UsuarioModificacion, H.TipoOperacion FROM HistorialConfiguraciones H JOIN  Configuraciones C ON H.FKConfiguraciones = C.PKConfiguraciones;');
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
      const logoLocalBase64 = encodeToBase64(logoLocalPath);

      const pool = await getConnection();

      const result = await pool
          .request()
          .input('nombreNegocio', sql.NVarChar, nombreNegocio)
          .input('logoLocal', sql.NVarChar, logoLocalBase64)
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

export const UpdateConfiguracion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID de configuración no proporcionado.' });
    }

    const { nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion } = req.body;

    if (!nombreNegocio) {
      return res.status(400).json({ error: 'Bad Request. Proporcione un nombre de negocio.' });
    }

    let logoLocalBase64;

    if (req.file) {
      // Solo llama a encodeToBase64 si hay una nueva imagen
      const logoLocalPath = req.file.path;
      logoLocalBase64 = encodeToBase64(logoLocalPath);
    }


    const pool = await getConnection();
    const result = await pool
      .request()
      .input('PKConfiguraciones', id)
      .input('NombreNegocio', sql.NVarChar, nombreNegocio || null)
      .input('LogoLocal', sql.NVarChar, logoLocalBase64 || null)
      .input('RUC', sql.NVarChar, ruc || null)
      .input('Telefonos', sql.NVarChar, telefonos || null)
      .input('Correo', sql.NVarChar, correo || null)
      .input('Direccion', sql.NVarChar, direccion || null)
      .input('UsuarioModificacion', sql.NVarChar, usuarioModificacion || null)
      .execute('ActualizarConfiguracion');

    if (result.returnValue === 0) {
      console.log("Registro actualizado:", { nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion });
      res.json({ nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion });
    } else {
      res.status(500).json({ error: 'Error en el procedimiento almacenado.' });
    }
  } catch (error) {
    console.error('Error al actualizar configuración:', error);

    if (error instanceof TypeError && error.message.includes('Cannot read properties')) {
      res.status(400).json({ error: 'Error de tipo - Verifica que los datos enviados son correctos.' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
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
  