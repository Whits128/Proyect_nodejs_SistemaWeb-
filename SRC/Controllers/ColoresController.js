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
    const pool = await getConnection();
    const result = await pool.request().query(querys.MostrarColores);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
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