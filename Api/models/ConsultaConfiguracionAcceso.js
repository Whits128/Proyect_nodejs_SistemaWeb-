import { getConnection, sql } from "./connection";

export const mostrarRoles = async () => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT IdRol as Codigo, NombreRol as Nombre FROM Roles ');
    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

export const mostrarRecursos = async () => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT IdRecurso as Codigo, NombreRecurso ,Ruta  FROM Recursos ');
    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

export const mostrarAcciones = async () => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT IdAccion as Codigo, NombreAccion  FROM Acciones  ');
    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};

export const mostrarConfiguracionesAcceso = async () => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .query(`
      SELECT
      ca.IdConfiguracion as Codigo,
      r.Ruta,
      r.NombreRecurso,
      a.NombreAccion,
      rol.NombreRol,
      ca.IdRecurso,
      ca.IdAccion,
      ca.IdRol
    FROM
      ConfiguracionAcceso ca
      JOIN Recursos r ON ca.IdRecurso = r.IdRecurso
      JOIN Acciones a ON ca.IdAccion = a.IdAccion
      JOIN Roles rol ON ca.IdRol = rol.IdRol;
      `);

    return result.recordset;
  } catch (error) {
    throw error;
  } finally {
    if (pool) {
      pool.close();
    }
  }
};




export const guardarConfiguracionAccesos = async (params) => {
  try {
    if (!params.ConfiguracionesXML.length) {
      throw new Error('Datos de compra incompletos o incorrectos.');
    }
    const ConfiguracionesXML = `<Configuraciones>${params.ConfiguracionesXML.map(Configuracion => {
      return `
        <Configuracion>
          <IdRecurso>${Configuracion.IdRecurso}</IdRecurso>
          <IdAccion>${Configuracion.IdAccion}</IdAccion>
          <IdRol>${Configuracion.IdRol}</IdRol>
        </Configuracion>`;
    }).join('')}</Configuraciones>`;
    
    
    // Imprimir los datos antes de la ejecución
    console.log('Datos que se enviarán al servidor:', params);
    // Imprimir el XML
    console.log('XML que se enviará al servidor:', ConfiguracionesXML);

    const pool = await getConnection();
    const result = await pool.request()
      .input('ConfiguracionesXML', sql.Xml, ConfiguracionesXML)
      .execute('InsertarConfiguracionAcceso');
 

   // Retornar el objeto con el código de compra
   return {
     resultado: result,
     datosEnviados: params,
   };



  } catch (error) {
    console.error(`Error al ejecutar Configuracion Acceso: ${error.message}`);
    throw error;
  }
};