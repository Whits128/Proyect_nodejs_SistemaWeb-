import { getConnection, sql } from "../models/connection";

export const mostrarCompra = async () => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .query('SELECT ID_Compra as Codigo, CodigoCompra, FechaCompra, Total, EstadoCompra FROM Compras');
    return result.recordset;
  } catch (error) {
    throw new Error(`Error al obtener las compras: ${error.message}`);
  }
};
export const ObtenerDatosParaEditar = async (Codigo) => {
  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('CodigoCompra', Codigo) // Asegúrate de pasar el código aquí
      .execute('ObtenerDetallesCompraPorCodigo'); // Cambié el método .query() por .execute()

    return result.recordset;
  } catch (error) {
    throw new Error(`Error al obtener detalles de compra: ${error.message}`);
  }
};




export const editarCompraEnDB = async (params) => {
  try {
    

    const detallesXml = `<DetallesCompra>${params.DetallesCompra.map(detalle => {
      return `<Detalle>
                <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
                <ID_Proveedor>${detalle.ID_Proveedor}</ID_Proveedor>
                <ID_BODEGA>${detalle.ID_BODEGA}</ID_BODEGA>
                <ID_Empleado>${detalle.ID_Empleado}</ID_Empleado>
                <Cantidad>${detalle.Cantidad}</Cantidad>
                <PrecioCompra>${detalle.PrecioCompra}</PrecioCompra>
                <Descuento>${detalle.Descuento}</Descuento>
                <Subtotal>${detalle.Subtotal}</Subtotal>
                <IVA>${detalle.IVA}</IVA>
                <Total>${detalle.Total}</Total>
              </Detalle>`;
    }).join('')}</DetallesCompra>`;

 // Imprimir los datos antes de la ejecución
 console.log('Datos que se enviarán al servidor:', params);
 // Imprimir el XML
 console.log('XML que se enviará al servidor:', detallesXml);

    const pool = await getConnection();
    const result = await pool.request()
      .input('CodigoCompra', sql.NVarChar(100), params.CodigoCompra)
      .input('FechaCompra', sql.Date, params.FechaCompra)
      .input('EstadoCompra', sql.NVarChar(50), params.EstadoCompra)
      .input('ID_BODEGA', sql.Int, params.ID_BODEGA)
      .input('ID_ProductoZapatos', sql.Int, params.ID_ProductoZapatos)
      .input('ID_Marca', sql.Int, params.ID_Marca)
      .input('ID_Talla', sql.Int, params.ID_Talla)
      .input('ID_Colores', sql.Int, params.ID_Colores)
      .input('ID_MaterialZapatos', sql.Int, params.ID_MaterialZapatos)
      .input('Total', sql.Decimal(10, 2), params.Total)
      .input('DetallesCompra', sql.Xml, detallesXml)
      .execute('EditarCompraDetalleInventario');

    return result;
  } catch (error) {
    console.error(`Error al ejecutar editarCompraEnDB: ${error.message}`);
    throw error;
  }
};




export const guardarCompra = async (params) => {
  try {
    if (!params.CodigoCompra || !params.FechaCompra || !params.Total || !params.DetallesCompra || !params.DetallesCompra.length) {
      throw new Error('Datos de compra incompletos o incorrectos.');
    }

    const detallesXml = `<DetallesCompra>${params.DetallesCompra.map(detalle => {
      return `<Detalle>
                <ID_Inventario>${detalle.ID_Inventario}</ID_Inventario>
                <ID_Proveedor>${detalle.ID_Proveedor}</ID_Proveedor>
                <ID_BODEGA>${detalle.ID_BODEGA}</ID_BODEGA>
                <ID_Empleado>${detalle.ID_Empleado}</ID_Empleado>
                <Cantidad>${detalle.Cantidad}</Cantidad>
                <PrecioCompra>${detalle.PrecioCompra}</PrecioCompra>
                <Descuento>${detalle.Descuento}</Descuento>
                <Subtotal>${detalle.Subtotal}</Subtotal>
                <IVA>${detalle.IVA}</IVA>
                <Total>${detalle.Total}</Total>
              </Detalle>`;
    }).join('')}</DetallesCompra>`;

 // Imprimir los datos antes de la ejecución
 console.log('Datos que se enviarán al servidor:', params);
 // Imprimir el XML
 console.log('XML que se enviará al servidor:', detallesXml);

    const pool = await getConnection();
    const result = await pool.request()
      .input('CodigoCompra', sql.NVarChar(100), params.CodigoCompra)
      .input('FechaCompra', sql.Date, params.FechaCompra)
      .input('EstadoCompra', sql.NVarChar(50), params.EstadoCompra)
      .input('ID_BODEGA', sql.Int, params.ID_BODEGA)
      .input('ID_ProductoZapatos', sql.Int, params.ID_ProductoZapatos)
      .input('ID_Marca', sql.Int, params.ID_Marca)
      .input('ID_Talla', sql.Int, params.ID_Talla)
      .input('ID_Colores', sql.Int, params.ID_Colores)
      .input('ID_MaterialZapatos', sql.Int, params.ID_MaterialZapatos)
      .input('Total', sql.Decimal(10, 2), params.Total)
      .input('DetallesCompra', sql.Xml, detallesXml)
      .execute('GestionarCompra');

    return result;
  } catch (error) {
    console.error(`Error al ejecutar guardarCompra: ${error.message}`);
    throw error;
  }
};

export const completarCompraEnDB = async (codigoCompra) => {
  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input('CodigoCompra', sql.NVarChar(100), codigoCompra)
      .input('FechaCompra', sql.Date, null)
      .input('EstadoCompra', sql.NVarChar(50),  'Completada')
      .input('ID_BODEGA', sql.Int,null)
      .input('ID_ProductoZapatos', sql.Int,null)
      .input('ID_Marca', sql.Int, null)
      .input('ID_Talla', sql.Int, null)
      .input('ID_Colores', sql.Int,null)
      .input('ID_MaterialZapatos', sql.Int, null)
      .input('Total', sql.Decimal(10, 2),null)
      .input('DetallesCompra', sql.Xml, null)
      .execute('GestionarCompra');

    return result;
  } catch (error) {
    console.error(`Error al ejecutar completarCompraEnDB: ${error.message}`);
    throw error;
  }
};
