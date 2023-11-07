import { getConnection, querys, sql } from "../DataBase";

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
    const pool = await getConnection();
    const result = await pool.request().query(querys.MostrarTallas);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};



export const saveTalla = async (req, res) => {
  const { nombre } = req.body;
  let { estado } = req.body;

  // Validación
  if (nombre == null  ) {
    return res.status(400).json({ msg: "Bad Request. Please provide a nombre" });
  }

  if (estado == null) estado = "Inactivo";

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("estado", sql.VarChar, estado)
      .query(querys.GuardarTallas);

    console.log("Nuevo registro creado:", { nombre, estado });

    res.json({ nombre,estado });
  } catch (error) {
    res.status(500).send(error.message);
  }
};






export const  UpdateTalla = async (req, res) => {
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
  
      .query(querys.UpdateTallas);
    res.json({ nombre,estado });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};