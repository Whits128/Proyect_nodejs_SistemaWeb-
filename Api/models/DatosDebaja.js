import { getConnection } from "../models/connection";
export const mostrarCategorias = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query('SELECT ID_Categoria as Codigo, Nombre  FROM Categorias WHERE Estado = \'Inactivo\'');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };
  
  export const activarCategoria = async (codigo) => {
    try {
      const pool = await getConnection();
      await pool
        .request()
        .input('codigo', codigo)
        .query('UPDATE Categorias SET Estado = \'Activo\' WHERE ID_Categoria = @codigo');
    } catch (error) {
      throw error;
    }
  };

  //seccion de Bodega

  export const mostrarBodega = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query('SELECT ID_BODEGA as Codigo, NOMBRE as Nombre  FROM BODEGA WHERE Estado = \'Inactivo\'');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };



  export const activarBodega = async (codigo) => {
    try {
      const pool = await getConnection();
      await pool
        .request()
        .input('codigo', codigo)
        .query('UPDATE BODEGA SET Estado = \'Activo\' WHERE ID_BODEGA = @codigo');
    } catch (error) {
      throw error;
    }
  };