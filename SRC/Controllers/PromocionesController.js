import { getConnection, querys, sql } from "../DataBase";

export const GetPromociones= async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlPromociones',{ pageTitle:'Promociones', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};


export const GetPromocion = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarPromociones} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarPromociones} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarPromociones);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const savePromocion = async (req, res) => {
  const {nombre, descripcion, fechaInicio, fechaFin, idProducto, estado} = req.body;

  if (nombre == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();
  
    
    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.VarChar, descripcion)
      .input("fechaInicio", sql.Date, fechaInicio)
      .input("fechaFin", sql.Date, fechaFin)
      .input("idProducto", sql.Int, idProducto)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.GuardarPromociones);

    console.log("Nuevo registro creado:", { nombre, descripcion, fechaInicio, fechaFin, idProducto, estado});

    res.json({nombre, descripcion, fechaInicio, fechaFin, idProducto, estado});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const UpdatePromocion  = async (req, res) => {
  const {  nombre, descripcion, fechaInicio, fechaFin, idProducto, estado} = req.body;

  if (nombre == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();
  

    await pool
      .request()
      .input("codigo", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.VarChar, descripcion)
      .input("fechaInicio", sql.Date, fechaInicio)
      .input("fechaFin", sql.Date, fechaFin)
      .input("idProducto", sql.Int, idProducto)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.UpdatePromociones);

    res.json({nombre, descripcion,fechaInicio,fechaFin,idProducto,estado});
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
      .query(querys.DarDeBajaPromociones);
    
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
      .query(querys.ActivarPromociones);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};
