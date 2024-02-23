import { getConnection, sql } from "../models/connection";
export const mostrarInventario  = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query(`
        select *from Vista_Inventario
        WHERE
            UnidadesExistencias >0;`);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };




  export const actualizarInventario = async (Codigo, pventa, existencia) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('Codigo', Codigo)
            .input('PrecioVenta', pventa)
            .input('ExistenciasMinimas', existencia)
            .query(`UPDATE Inventario 
                    SET PrecioVenta = @PrecioVenta, ExistenciasMinimas = @ExistenciasMinimas 
                    WHERE ID_Inventario = @Codigo;`);
        return result.recordset;
    } catch (error) {
        throw error;
    }
};
