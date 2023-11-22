import { getConnection, querys, sql } from "../DataBase";

export const GetColores = async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlColores.ejs',{ pageTitle: 'Colores', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};


export const GetColor = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarColores} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarColores} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarColores);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const saveColor = async (req, res) => {
    const { color } = req.body;
    let { estado } = req.body;
  
    // Validación
    if (color == null) {
      return res.status(400).json({ msg: "Bad Request. Please provide a nombre" });
    }
  
    if (estado == null) estado = "Inactivo";
  
    try {
      const pool = await getConnection();
  
      await pool
        .request()
        .input("color", sql.VarChar, color)
        .input("estado", sql.VarChar, estado)
        .query(querys.GuardarColores); 
  
      console.log("Nuevo registro creado:", { color, estado });
  
      res.json({ color, estado });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  






export const  UpdateColor = async (req, res) => {
  const {  color, estado } = req.body;

  // validating
  if ( color == null || estado == null) {
    return res.status(400).json({ msg: "Baddd Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id)
      .input("color", sql.VarChar, color)
      .input("estado", sql.VarChar, estado)
  
      .query(querys.updateColores);
    res.json({ color, estado });
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
      .query(querys.DarDeBajaColores);
    
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
      .query(querys.ActivarColores);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};
