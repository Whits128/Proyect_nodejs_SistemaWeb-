import { getConnection, querys, sql } from "../DataBase";

export const GetProductos= async (req, res) => {
  try {

    res.render('CtlProducto.ejs',{ pageTitle: 'Proctos', user:req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetProducto= async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.MostrarProducto);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};



export const saveProducto = async (req, res) => {
    const { nombre, descripcion,id_categoria } = req.body;
    let { estado } = req.body;
  
    // validating
    if (descripcion == null || nombre == null) {
      return res.status(400).json({ msg: "Bad Request. Please fill all fields" });
    }
  
    if (estado == null) estado = 0;
  
    try {
      const pool = await getConnection();
  
      await pool
        .request()
        .input("nombre", sql.VarChar,nombre)
        .input("descripcion", sql.VarChar,descripcion)
        .input("id_categoria", sql.Int,id_categoria)
        .input("estado", sql.VarChar,estado)
   
        .query(querys.GuardarProducto);
  
      res.json({ nombre, descripcion, id_categoria,estado });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  




export const  UpdateProducto= async (req, res) => {
  const {  nombre, estado ,descripcion,id_categoria} = req.body;

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
      .input("descripcion", sql.VarChar, descripcion)
      .input("id_categoria", sql.Int, id_categoria)
      .input("estado", sql.VarChar, estado)
      .query(querys.updateProducto);
    res.json({ nombre,descripcion,id_categoria, estado});
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};