import { getConnection, querys, sql } from "../DataBase";
export const GetCategorias = async (req, res) => {
  try {
    const { filtro } = req.params;
    res.render('CtlCagoria.ejs', { pageTitle: 'Categorias', user: req.user, filtro, });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const GetCategoria = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarCategoria} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarCategoria} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarCategoria);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const saveCategoria = async (req, res) => {
  const { nombre } = req.body;
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
      .input("estado", sql.VarChar, estado)
      .query(querys.GuardarCategoria);

    console.log("Nuevo registro creado:", { nombre, estado });

    res.json({ nombre, estado });
  } catch (error) {
    res.status(500).send(error.message);
  }
};






export const  UpdateCategoria = async (req, res) => {
  const {  nombre, estado } = req.body;

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
      .input("estado", sql.VarChar, estado)
  
      .query(querys.updateCategoria);
    res.json({ nombre, estado });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



export const DarDeBajaCategoria = async (req, res) => {
  try {
    console.log('Recibiendo solicitud para dar de baja la categoría con ID:', req.params.id);
    
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id) 
      .query(querys.DarDeBajaCategoria);
    
    console.log('Categoría dada de baja exitosamente.');
    res.json({ msg: "Category deactivated successfully" });
  } catch (error) {
    console.error('Error al dar de baja la categoría:', error);
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
      .query(querys.DarDeBajaCategoria);
    
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
      .query(querys.ActivarCategoria);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};
