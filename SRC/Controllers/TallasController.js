import { getConnection, querys, sql } from "../DataBase";
// Importa validationResult
import { validationResult } from 'express-validator';
export const GetTallas = async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlTallas.ejs',{ pageTitle: 'Tallas', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetTalla = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarTallas} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarTallas} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarTallas);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



export const saveTalla = async (req, res) => {
  const { NumeroTalla } = req.body;
  let { estado } = req.body;
 // Verifica si hay errores de validación
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("NumeroTalla", sql.VarChar, NumeroTalla)
      .input("estado", sql.VarChar, estado)
      .query(querys.GuardarTallas);

    console.log("Nuevo registro creado:", { NumeroTalla, estado });

    res.json({ NumeroTalla,estado });
  } catch (error) {
    res.status(500).send(error.message);
  }
};






export const  UpdateTalla = async (req, res) => {
  const { NumeroTalla,estado } = req.body;

  // validating
  if ( NumeroTalla == null || estado == null) {
    return res.status(400).json({ msg: "Baddd Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id)
      .input("NumeroTalla", sql.VarChar, NumeroTalla)
      .input("estado", sql.VarChar, estado)
  
      .query(querys.UpdateTallas);
    res.json({ NumeroTalla,estado });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const DarDeBaja = async (req, res) => {
  try {
    console.log('Recibiendo solicitud para dar de baja la Talla con ID:', req.params.id);
    
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id) 
      .query(querys.DarDeBajaTallas);
    
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
      .query(querys.ActivarTallas);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};
