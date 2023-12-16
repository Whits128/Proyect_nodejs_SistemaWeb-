import { getConnection, sql } from "../models/connection";
export const mostrarInventario  = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
        .request()
        .query(`SELECT I.ID_Inventario,
        B.NOMBRE AS NombreBodega,
        P.Nombre AS NombreProducto,
        M.Nombre AS NombreMarca,
        T.NumeroTalla,
        C.Color,
        Mat.Nombre AS NombreMaterial,
        I.Estado
    FROM
        Inventario I
    JOIN
        BODEGA B ON I.ID_BODEGA = B.ID_BODEGA
    JOIN
        Productos_Zapatos P ON I.ID_ProductoZapatos = P.ID_ProductoZapatos
    JOIN
        Marcas M ON I.ID_Marca = M.ID_Marca
    JOIN
        Tallas T ON I.ID_Talla = T.ID_Talla
    JOIN
        Colores C ON I.ID_Colores = C.ID_Colores
    JOIN
        MaterialesZapatos Mat ON I.ID_MaterialZapatos = Mat.ID_MaterialZapatos;`);
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };



  export const agregarProductoAlInventario = async (producto) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('ID_Bodega', sql.Int, producto.idBodega)
            .input('ID_ProductoZapatos', sql.Int, producto.idProducto)
            .input('ID_Marca', sql.Int, producto.idMarca)
            .input('ID_Talla', sql.Int, producto.idTalla)
            .input('ID_Colores', sql.Int, producto.idColores)
            .input('ID_MaterialZapatos', sql.Int, producto.idMaterial)
            .input('Estado', sql.NVarChar, producto.estado)
            .execute('AgregarProductoAlInventario');
        return result;
    } catch (error) {
        throw error;
    }
};

export const actualizarInventario = async (Codigo, producto) => {
    try {
        const pool = await getConnection();
        const result = await pool
            .request()
            .input('Codigo', sql.Int,Codigo)
            .input('ID_Bodega', sql.Int, producto.idBodega)
            .input('ID_ProductoZapatos', sql.Int, producto.idProducto)
            .input('ID_Marca', sql.Int, producto.idMarca)
            .input('ID_Talla', sql.Int, producto.idTalla)
            .input('ID_Colores', sql.Int, producto.idColores)
            .input('ID_MaterialZapatos', sql.Int, producto.idMaterial)
            .input('Estado', sql.NVarChar, producto.estado)
            .execute('ActualizarInventario');

        return result;
    } catch (error) {
        throw error;
    }
};