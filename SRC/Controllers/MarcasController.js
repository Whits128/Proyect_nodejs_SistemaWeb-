import { getConnection, querys, sql } from "../DataBase";

export const GetMarcas = async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlMarcas.ejs',{ pageTitle: 'Marcas', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetMarca = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarMarcas} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarMarcas} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarMarcas);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



export const saveMarca = async (req, res) => {
  const { nombre,detalleMarca } = req.body;
  let { estado } = req.body;

  // Validación
  if (nombre == null  || detalleMarca == null) {
    return res.status(400).json({ msg: "Bad Request. Please provide a nombre" });
  }

  if (estado == null) estado = "Inactivo";

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("detalleMarca", sql.VarChar, detalleMarca)
      .input("estado", sql.VarChar, estado)
      .query(querys.GuardarMarcas);

    console.log("Nuevo registro creado:", { nombre, estado });

    res.json({ nombre,detalleMarca,estado });
  } catch (error) {
    res.status(500).send(error.message);
  }
};






export const  UpdateMarca = async (req, res) => {
  const {  nombre, estado,detalleMarca } = req.body;

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
      .input("detalleMarca", sql.VarChar, detalleMarca)
      .input("estado", sql.VarChar, estado)
  
      .query(querys.updateMarcas);
    res.json({ nombre,detalleMarca,estado });
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
      .query(querys.DarDeBajaMarcas);
    
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
      .query(querys.ActivarMarcas);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};
