import { getConnection, querys, sql } from "../DataBase";

export const GetMaterialesZapatos = async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlMaterialesZapatos.ejs',{ pageTitle: 'MaterialesZapatos', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetMaterialesZapato = async (req, res) => {
  try {
    const { filtro } = req.query; // Cambio aquí

    const pool = await getConnection();
    let result;

    if (filtro === 'Activos') {
      result = await pool.request().query(`${querys.MostrarMaterialesZapatos} WHERE Estado = 'Activo'`);
    } else if (filtro === 'Inactivos') {
      result = await pool.request().query(`${querys.MostrarMaterialesZapatos} WHERE Estado != 'Activo'`);
    } else {
      result = await pool.request().query(querys.MostrarMaterialesZapatos);
    }

    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};


export const saveMaterialesZapato = async (req, res) => {
  const { nombre,descripcion,tipoMaterial,tipodeCostura, tipoSuela, fabricante,observaciones,estado} = req.body;

  if (nombre == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.Text, descripcion)
      .input("tipoMaterial", sql.VarChar, tipoMaterial)
      .input("tipodeCostura", sql.VarChar, tipodeCostura)
      .input("tipoSuela", sql.VarChar, tipoSuela)
      .input("fabricante", sql.VarChar, fabricante)
      .input("observaciones", sql.Text, observaciones)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.GuardarMaterialesZapatos);

    console.log("Nuevo registro creado:", { nombre,descripcion,tipoMaterial,tipodeCostura, tipoSuela, fabricante,observaciones,estado });

    res.json({nombre,descripcion,tipoMaterial,tipodeCostura, tipoSuela, fabricante,observaciones,estado});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const UpdateMaterialesZapato = async (req, res) => {
  const {nombre,descripcion,tipoMaterial,tipodeCostura, tipoSuela, fabricante,observaciones,estado} = req.body;

  if (nombre == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .input("descripcion", sql.Text, descripcion)
      .input("tipoMaterial", sql.VarChar, tipoMaterial)
      .input("tipodeCostura", sql.VarChar, tipodeCostura)
      .input("tipoSuela", sql.VarChar, tipoSuela)
      .input("fabricante", sql.VarChar, fabricante)
      .input("observaciones", sql.Text, observaciones)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.UpdateMaterialesZapatos);
    res.json({ nombre,descripcion,tipoMaterial,tipodeCostura, tipoSuela, fabricante,observaciones,estado });
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
      .query(querys.DarDeBajaMaterialesZapatos);
    
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
      .query(querys.ActivarMaterialesZapatos);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};