import { getConnection, querys, sql } from "../DataBase";

export const GetCategorias = async (req, res) => {
  try {
    //const pool = await getConnection();
    //const result = await pool.request().query(querys.getAllProducts);
    //var data = JSON.stringify(Object.assign([], result.recordset));
    //var data = (result.recordset);
    res.render('CtlCagoria.ejs',{user:req.user});
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetCategoria = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.MostrarCategoria);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};



export const saveCategoria = async (req, res) => {
  const { nombre } = req.body;
  let { estado } = req.body;

  // Validación
  if (nombre == null) {
    return res.status(400).json({ msg: "Bad Request. Please provide a nombre" });
  }

  if (estado == null) estado = 0;

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("estado", sql.Int, estado)
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
      .input("estado", sql.Int, estado)
  
      .query(querys.updateCategoria);
    res.json({ nombre, estado });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};