import { getConnection } from "../models/connection";

export const mostrarInventarioCantidadProducto = async () => {
    let pool;
    try {
      pool = await getConnection(); // Establecer conexión
      const result = await pool
        .request()
        .query('select *from  VistaInventario'); // Ejecutar consulta
      return result.recordset; // Devolver resultados
    } catch (error) {
      throw error; // Lanzar cualquier error que ocurra
    } finally {
      if (pool) {
        try {
          await pool.close(); // Cerrar conexión en el bloque finally
        } catch (error) {
          console.error('Error al cerrar la conexión:', error.message);
        }
      }
    }
  };