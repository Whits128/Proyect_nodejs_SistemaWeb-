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

  //seccion de Producto

  export const mostrarProductos = async () => {
    try {
      const pool = await getConnection();
      const result = await pool
      .request()
      .query('SELECT ID_ProductoZapatos as Codigo, NOMBRE as Nombre  FROM Productos_Zapatos WHERE Estado = \'Inactivo\'');
      return result.recordset;
    } catch (error) {
      throw error;
    }
  };

  export const activarProductoZapatos = async (codigo) => {
    try {
      const pool = await getConnection();
      await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Productos_Zapatos SET Estado = \'Activo\' WHERE ID_ProductoZapatos = @codigo');
    } catch (error) {
      throw error;
    }
  };


  //Seccion de Proveedores

export const mostrarProveedoresInactivos = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Proveedor as Codigo, NOMBRE as Nombre FROM Proveedores WHERE Estado = \'Inactivo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const activarProveedor = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Proveedores SET Estado = \'Activo\' WHERE ID_Proveedor = @codigo');
  } catch (error) {
    throw error;
  }
};

//Sección de Colores
 export const mostrarColoresInactivos = async () => {
  try{
    const pool = await getConnection();
    const result = await pool
    .request()
    .query('SELECT ID_Colores as Codigo, COLOR as Color From Colores WHERE Estado = \'Inactivo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
 };

 export const activarColores = async (codigo) => {
   try{
    const pool = await getConnection();
    await pool
    .request()
    .input('codigo', codigo)
    .query('UPDATE Colores SET Estado = \'Activo\' WHERE ID_Colores = @codigo');
   } catch (error) {
    throw error;
   }
 };


 // Seccion Promociones

 export const mostrarPromocionesInactivas = async () => {
  try{
    const pool = await getConnection();
    const result = await pool
    .request()
    .query('SELECT ID_Promocion as Codigo, NOMBRE as Nombre From Promociones WHERE Estado = \'Inactivo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
 };

 export const activarPromociones = async (codigo) => {
   try{
    const pool = await getConnection();
    await pool
    .request()
    .input('codigo', codigo)
    .query('UPDATE Promociones SET Estado = \'Activo\' WHERE ID_Promocion = @codigo');
   } catch (error) {
    throw error;
   }
 };

 export const mostrarTallasInactivas = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Talla as Codigo, NumeroTalla as Numero FROM Tallas WHERE Estado = \'Inactivo\'');
    return result.recordset;
  } catch (error) {
    throw error;
  }
};

export const activarTalla = async (codigo) => {
  try {
    const pool = await getConnection();
    await pool
      .request()
      .input('codigo', codigo)
      .query('UPDATE Tallas SET Estado = \'Activo\' WHERE ID_Talla = @codigo');
  } catch (error) {
    throw error;
  }
};
