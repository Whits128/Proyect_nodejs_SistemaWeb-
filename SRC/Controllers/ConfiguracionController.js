import { getConnection, querys, sql } from "../DataBase";
import fs from 'fs';

const encodeToBase64 = (filePath) => {
    const data = fs.readFileSync(filePath);
    return data.toString('base64');
};

export const GetConfiguraciones = async (req, res) => {
    try {
        // Recopila los datos específicos para esta vista
        res.render('CtlConfiguracion.ejs', { pageTitle: 'Configuracion', user: req.user });
    } catch (error) {
        res.status(500);
        // res.send(error.message);  
    }
};

export const GetHistorialConfiguracione = async (req, res) => {
    try {
        // Recopila los datos específicos para esta vista
        res.render('HistorialConfiguraciones.ejs', { pageTitle: 'HistorialConfiguraciones', user: req.user , layout: false});
    } catch (error) {
        res.status(500);
        // res.send(error.message);  
    }
};





  
export const GetHistorialConfiguraciones = async (req, res) => {
    try {
      const pool = await getConnection();
      const result = await pool.request().query(querys.cargarHistorial);
      
      res.json(result.recordset);
    } catch (error) {
      res.status(500);
      //res.send(error.message);  
    }
  };



  export const GetConfiguracion = async (req, res) => {
    try {
      const { filtro } = req.query; // Cambio aquí
  
      const pool = await getConnection();
      let result;
  
      if (filtro === 'Activos') {
        result = await pool.request().query(`${querys.mostrarConfiguraciones} WHERE Estado = 'Activo'`);
      } else if (filtro === 'Inactivos') {
        result = await pool.request().query(`${querys.mostrarConfiguraciones} WHERE Estado != 'Activo'`);
      } else {
        result = await pool.request().query(querys.mostrarConfiguraciones);
      }
  
      res.json(result.recordset);
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  };

export const saveConfiguracion = async (req, res) => {
    const { nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion, tipoOperacion } = req.body;
    let { estado } = req.body;

    if (!nombreNegocio) {
        return res.status(400).json({ msg: "Bad Request. Please provide a nombreNegocio" });
    }

    if (!estado) {
        estado = "Inactivo";
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
            .input('estado', sql.NVarChar, estado)
            .input('usuarioModificacion', sql.NVarChar, usuarioModificacion)
            .input('tipoOperacion', sql.NVarChar, tipoOperacion)
            .execute('InsertarConfiguracionYHistorial');

        console.log("Nuevo registro creado:", { nombreNegocio, ruc, telefonos, correo, direccion, estado, usuarioModificacion, tipoOperacion });

        res.json({ nombreNegocio, ruc, telefonos, correo, direccion, estado, usuarioModificacion, tipoOperacion });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const UpdateConfiguracion = async (req, res) => {
    const { nombreNegocio, ruc, telefonos, correo, direccion, usuarioModificacion, tipoOperacion } = req.body;
    let { estado } = req.body;

    if (!nombreNegocio) {
        return res.status(400).json({ msg: "Bad Request. Please provide a nombreNegocio" });
    }

    if (!estado) {
        estado = "Inactivo";
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
        .input('PKConfiguraciones', req.params.id)
        .input('NombreNegocio', sql.NVarChar, nombreNegocio || null)
        .input('LogoLocal', sql.NVarChar, logoLocalBase64 || null)
        .input('RUC', sql.NVarChar, ruc || null)
        .input('Telefonos', sql.NVarChar, telefonos || null)
        .input('Correo', sql.NVarChar, correo || null)
        .input('Direccion', sql.NVarChar, direccion || null)
        .input('UsuarioModificacion', sql.NVarChar, usuarioModificacion || null)
        .execute('ActualizarConfiguracion')
    
    
            console.log("Recibida solicitud de actualización:", req.body, req.file);

        if (result.returnValue === 0) {
            console.log("Registro actualizado:", { nombreNegocio, ruc, telefonos, correo, direccion, estado, usuarioModificacion, tipoOperacion });
            res.json({ nombreNegocio, ruc, telefonos, correo, direccion, estado, usuarioModificacion });
        } else {
            res.status(500).json({ msg: "Error en el procedimiento almacenado" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ msg: error.message });
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
  