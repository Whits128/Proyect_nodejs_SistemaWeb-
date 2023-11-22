import { getConnection, querys, sql } from "../DataBase";

export const GetZapatosDanados= async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlZapatosDañados',{ pageTitle:'Zapatos Dañados', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetZapatosDanado = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.MostrarZapatosDanados);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};


export const saveZapatosDanado  = async (req, res) => {
  const { idProducto, descripcion,fechaDeteccion, acciones, estado} = req.body;

  if (idProducto == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();
  
    
    await pool
      .request()
      .input("idProducto", sql.Int, idProducto)
      .input("descripcion", sql.VarChar, descripcion)
      .input("fechaDeteccion", sql.Date, fechaDeteccion)
      .input("acciones", sql.VarChar, acciones)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.GuardarZapatoDanado);

    console.log("Nuevo registro creado:", { idProducto, descripcion, fechaDeteccion, acciones, estado});

    res.json({idProducto, descripcion, fechaDeteccion, acciones, estado});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const UpdateZapatosDanado = async (req, res) => {
  const { idProducto, descripcion, fechaDeteccion,acciones, estado } = req.body;

  if (idProducto == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();
  

    await pool
      .request()
      .input("codigo", req.params.id)
      .input("idProducto", sql.Int, idProducto)
      .input("descripcion", sql.NVarChar, descripcion)
      .input("fechaDeteccion", sql.Date, fechaDeteccion)
      .input("acciones", sql.NVarChar, acciones)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.UpdateZapatoDanado);

    res.json({ idProducto, descripcion, fechaDeteccion, acciones, estado });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
