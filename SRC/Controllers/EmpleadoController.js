import { getConnection, querys, sql } from "../DataBase";

export const GetEmpleados= async (req, res) => {
  try {
    // Recopila los datos específicos para esta vista
  
    res.render('CtlEmpleado.ejs',{ pageTitle:'Empleado', user: req.user });
    //res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};

export const GetEmpleado = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(querys.MostrarEmpleados);
    
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    //res.send(error.message);  
  }
};


export const saveEmpleado = async (req, res) => {
  const { nombre, apellido, direccion, telefono, estado} = req.body;

  if (nombre == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();

    await pool
      .request()
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("direccion", sql.VarChar, direccion)
      .input("telefono", sql.VarChar, telefono)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.GuardarEmpleado);

    console.log("Nuevo registro creado:", { nombre,apellido,direccion,telefono, estado});

    res.json({nombre,apellido,direccion,telefono, estado});
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const UpdateEmpleado = async (req, res) => {
  const { nombre, apellido, direccion, telefono, estado} = req.body;

  if (nombre == null) {
    return res.status(400).json({ msg: "Solicitud incorrecta. Proporcione un nombre" });
  }

  try {
    const pool = await getConnection();
    await pool
      .request()
      .input("codigo", req.params.id)
      .input("nombre", sql.VarChar, nombre)
      .input("apellido", sql.VarChar, apellido)
      .input("direccion", sql.VarChar, direccion)
      .input("telefono", sql.VarChar, telefono)
      .input("estado", sql.NVarChar, estado || 'Activo') // Usar 'Activo' si no se proporciona el estado
      .query(querys.UpdateEmpleado);
    res.json({  nombre, apellido, direccion, telefono, estado });
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
      .query(querys.DarDeBajaEmpleado);
    
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
      .query(querys.ActivarEmpleado);
    
    console.log('Talla activada exitosamente.');
    res.json({ msg: "Size activated successfully" });
  } catch (error) {
    console.error('Error al activar la Talla:', error);
    res.status(500);
    res.send(error.message);
  }
};
