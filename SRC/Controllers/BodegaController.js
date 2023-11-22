import { getConnection, querys, sql } from "../DataBase";
export const GetBodegas = async (req, res) => {
  try {
    const { filtro } = req.params;

    // Lógica para recopilar datos específicos para esta vista
    // Puedes pasar el filtro a la vista
    res.render('CtlBodega.ejs', { pageTitle: 'Bodega', user: req.user, filtro, });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const GetBodega = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarBodegas} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarBodegas} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarBodegas);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const saveBodega = async (req, res) => {
  const { nombre ,ubicacion} = req.body;
  let { estado } = req.body;

  // Validación
  if (nombre == null) {
    return res.status(400).json({ msg: "Bad Request. Please provide a nombre" });
  }

  if (estado == null) estado = "Inactivo";

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("ubicacion", sql.VarChar, ubicacion)
      .input("estado", sql.VarChar, estado)
      .query(querys.GuardarBodega);

    console.log("Nuevo registro creado:", { nombre,ubicacion, estado });

    res.json({ nombre, ubicacion,estado });
  } catch (error) {
    res.status(500).send(error.message);
  }
};






export const  UpdateBodega = async (req, res) => {
  const { nombre,ubicacion, estado } = req.body;

  // validating
  if ( nombre == null || estado == null) {
    return res.status(400).json({ msg: "Baddd Request. Please fill all fields" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .input("ubicacion", sql.VarChar, ubicacion)
      .input("estado", sql.VarChar, estado)
  
      .query(querys.ActualizarBodega);
    res.json({ nombre, ubicacion,estado });
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
