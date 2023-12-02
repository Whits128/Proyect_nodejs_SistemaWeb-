import { sql, getConnection } from "../models/connection";


export const obtenerNombreUsuarioYRol = async (loginUsuario) => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .input('loginUsuario', sql.NVarChar(50), loginUsuario)
        .query(`
          SELECT U.IdUsuario,U.Nombres, U.Apellidos, R.NombreRol,R.IdRol
          FROM USUARIO U
          INNER JOIN Roles R ON U.IdRol = R.IdRol
          WHERE U.LoginUsuario = @loginUsuario
        `);
  
      return result.recordset[0];
    } catch (error) {
      console.error('Error al obtener el nombre y rol del usuario:', error.message);
      throw error;
    }
  };


  export const obtenerTotalUsuarios = async () => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .query('SELECT COUNT(*) AS TotalUsuarios FROM USUARIO');

        return result.recordset[0].TotalUsuarios;
    } catch (error) {
        console.error('Error al obtener el total de usuarios:', error.message);
        throw error;
    }
};